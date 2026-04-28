const std = @import("std");
const sokol = @import("sokol");
const sg = sokol.gfx;
const sapp = sokol.app;
const sglue = sokol.glue;
const sgl = sokol.gl;

const font = @import("font.zig");
const ui = @import("ui.zig");
const physics = @import("physics.zig");
const data_loader = @import("data_loader.zig");

const font_ttf = @embedFile("assets/font.ttf");
const portfolio_json = @embedFile("assets/data.json");

// Minimal C-style print to avoid std.log/std.fmt triggers
const c = @cImport({
    @cInclude("stdio.h");
});

fn log_info(str: [:0]const u8) void {
    _ = c.printf("%s\n", str.ptr);
}

const AppState = struct {
    atlas: font.FontAtlas,
    ui: ui.UIState,
    sim: physics.Simulation,
    data: std.json.Parsed(data_loader.PortfolioData),
    pass_action: sg.PassAction,
    boot_percent: f32 = 0,
    is_booted: bool = false,
    current_time: f64 = 0,
    is_cruel_mode: bool = false,
    terminal_input: [256]u8 = undefined,
    terminal_len: usize = 0,
    terminal_history: [10][256]u8 = undefined,
    terminal_history_count: usize = 0,
};

var state: AppState = undefined;

export fn init() void {
    log_info("INIT: Starting SulkyOS...");
    sg.setup(.{
        .environment = sglue.environment(),
        .logger = .{ .func = sokol.log.func },
    });
    sgl.setup(.{
        .logger = .{ .func = sokol.log.func },
    });

    const allocator = std.heap.page_allocator;

    state.atlas = font.FontAtlas.init(font_ttf, 1024, 1024) catch {
        return;
    };

    state.ui = .{
        .atlas = &state.atlas,
        .screen_width = 800,
        .screen_height = 600,
        .mouse_x = 0,
        .mouse_y = 0,
    };

    state.data = data_loader.load(allocator, portfolio_json) catch {
        return;
    };

    const node_count = state.data.value.projects.len + 1;
    const links = allocator.alloc(physics.Link, state.data.value.projects.len) catch {
        return;
    };
    for (state.data.value.projects, 0..) |_, i| {
        links[i] = .{ .source = 0, .target = i + 1 };
    }

    state.sim = physics.Simulation.init(allocator, node_count, links, 800, 600) catch {
        return;
    };

    state.pass_action = .{};
    state.pass_action.colors[0] = .{
        .load_action = .CLEAR,
        .clear_value = .{ .r = 0.05, .g = 0.05, .b = 0.05, .a = 1.0 },
    };
    
    state.terminal_len = 0;
    state.terminal_history_count = 0;
    log_info("INIT: Complete");
}

export fn event(ev: [*c]const sapp.Event) void {
    if (ev.*.type == .CHAR and state.is_booted) {
        if (ev.*.char_code == 13) { // Enter
            const cmd = state.terminal_input[0..state.terminal_len];
            if (std.mem.eql(u8, cmd, "/cruel")) {
                state.is_cruel_mode = !state.is_cruel_mode;
                state.ui.is_cruel_mode = state.is_cruel_mode;
                if (state.is_cruel_mode) {
                    state.pass_action.colors[0].clear_value = .{ .r = 0.1, .g = 0.0, .b = 0.0, .a = 1.0 };
                } else {
                    state.pass_action.colors[0].clear_value = .{ .r = 0.05, .g = 0.05, .b = 0.05, .a = 1.0 };
                }
            }
            state.terminal_len = 0;
        } else if (ev.*.char_code == 8 or ev.*.char_code == 127) { // Backspace
            if (state.terminal_len > 0) state.terminal_len -= 1;
        } else if (state.terminal_len < 255) {
            state.terminal_input[state.terminal_len] = @intCast(ev.*.char_code);
            state.terminal_len += 1;
        }
    }
}

export fn frame() void {
    const dt = @as(f32, @floatCast(sapp.frameDuration()));
    state.current_time += dt;

    if (!state.is_booted) {
        state.boot_percent += dt * 50.0;
        if (state.boot_percent >= 37.0) {
            state.boot_percent = 37.0;
            if (state.current_time > 1.5) state.is_booted = true;
        }
    }

    state.sim.update(dt * 60.0);

    const width = sapp.widthf();
    const height = sapp.heightf();
    state.ui.begin(width, height);

    const link_color = if (state.is_cruel_mode) ui.Color{ .r = 0.4, .g = 0.0, .b = 0.0, .a = 1.0 } else ui.Color{ .r = 0.2, .g = 0.2, .b = 0.2, .a = 1.0 };
    sgl.c4f(link_color.r, link_color.g, link_color.b, link_color.a);
    sgl.beginLines();
    for (state.sim.links) |link| {
        const n0 = state.sim.nodes[link.source];
        const n1 = state.sim.nodes[link.target];
        sgl.v2f(n0.x, n0.y);
        sgl.v2f(n1.x, n1.y);
    }
    sgl.end();

    if (!state.is_booted) {
        state.ui.text(width / 2.0 - 150.0, height / 2.0, "BOOTING SULKYOS...", .{ .r = 0.0, .g = 1.0, .b = 0.0, .a = 1.0 });
    } else {
        const accent_color = if (state.is_cruel_mode) ui.Color{ .r = 1.0, .g = 0.0, .b = 0.0, .a = 1.0 } else ui.Color{ .r = 0.5, .g = 0.8, .b = 1.0, .a = 1.0 };
        state.ui.text(20, 40, "SULKYOS v4.0.0 [STABLE]", accent_color);
        state.ui.text(20, 70, state.data.value.about.name, .{ .r = 1.0, .g = 1.0, .b = 1.0, .a = 1.0 });
        state.ui.text(20, 100, state.data.value.about.title, .{ .r = 0.7, .g = 0.7, .b = 0.7, .a = 1.0 });

        const exclusion_fn = struct {
            fn func(y: f32) ui.Rect {
                _ = y;
                return .{ .x = 400, .y = 200, .w = 150, .h = 150 };
            }
        }.func;

        const bio = if (state.is_cruel_mode) state.data.value.about.cruelBio else state.data.value.about.bio;
        state.ui.text_wrapped_with_exclusion(
            20, 150, 600, 25,
            bio,
            .{ .r = 0.9, .g = 0.9, .b = 0.9, .a = 1.0 },
            &exclusion_fn,
        );

        state.ui.text(20, 450, "--- PROJECTS ---", .{ .r = 0.0, .g = 1.0, .b = 0.5, .a = 1.0 });
        var py: f32 = 480;
        for (state.data.value.projects) |proj| {
            if (py > height - 300) break;
            state.ui.text(20, py, proj.title, .{ .r = 1.0, .g = 1.0, .b = 0.0, .a = 1.0 });
            py += 25;
        }

        const bx: f32 = width / 2.0 + 50.0;
        state.ui.text(bx, 450, "--- LOGS ---", .{ .r = 1.0, .g = 0.5, .b = 0.0, .a = 1.0 });
        var by: f32 = 480;
        for (state.data.value.posts) |post| {
            if (by > height - 100) break;
            state.ui.text(bx, by, post.title, .{ .r = 0.8, .g = 0.8, .b = 1.0, .a = 1.0 });
            by += 25;
        }

        state.ui.text(20, height - 40, "> ", .{ .r = 0.0, .g = 1.0, .b = 0.0, .a = 1.0 });
        state.ui.text(40, height - 40, state.terminal_input[0..state.terminal_len], .{ .r = 1.0, .g = 1.0, .b = 1.0, .a = 1.0 });
    }

    state.ui.end();

    sg.beginPass(.{ .action = state.pass_action, .swapchain = sglue.swapchain() });
    sgl.draw();
    sg.endPass();
    sg.commit();
}

export fn cleanup() void {
    state.atlas.deinit();
    sgl.shutdown();
    sg.shutdown();
}

pub fn main() void {
    sapp.run(.{
        .init_cb = init,
        .frame_cb = frame,
        .event_cb = event,
        .cleanup_cb = cleanup,
        .width = 1200,
        .height = 900,
        .window_title = "SulkyOS v4.0",
        .icon = .{ .sokol_default = true },
        .logger = .{ .func = sokol.log.func },
    });
}
