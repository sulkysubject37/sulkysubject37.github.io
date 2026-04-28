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

// Minimal C-style print
const c = @cImport({
    @cInclude("stdio.h");
    @cInclude("string.h");
});

fn log_info(str: [:0]const u8) void {
    _ = c.printf("%s\n", str.ptr);
}

const AppState = struct {
    atlas: font.FontAtlas,
    ui: ui.UIState,
    sim: physics.Simulation,
    // data: data_loader.PortfolioData, // Skip std.json parsed for now
    pass_action: sg.PassAction,
    boot_percent: f32 = 0,
    is_booted: bool = false,
    current_time: f64 = 0,
    is_cruel_mode: bool = false,
    terminal_input: [256]u8 = undefined,
    terminal_len: usize = 0,
};

var state: AppState = undefined;

export fn init() void {
    log_info("INIT: Starting SulkyOS...");
    sg.setup(.{
        .environment = sglue.environment(),
    });
    sgl.setup(.{});

    state.pass_action = .{};
    state.pass_action.colors[0] = .{
        .load_action = .CLEAR,
        .clear_value = .{ .r = 0.05, .g = 0.05, .b = 0.05, .a = 1.0 },
    };

    // No std.heap, use a raw allocator if needed but font bake needs it
    // Try using page_allocator only if it doesn't trigger Threaded.zig
    state.atlas = font.FontAtlas.init(font_ttf, 512, 512) catch {
        log_info("INIT: Font bake failed");
        return;
    };

    state.ui = .{
        .atlas = &state.atlas,
        .screen_width = 800,
        .screen_height = 600,
        .mouse_x = 0,
        .mouse_y = 0,
    };

    // Skip complex data loading for now to confirm rendering
    // state.data = data_loader.load(std.heap.page_allocator, portfolio_json) catch ...

    state.terminal_len = 0;
    log_info("INIT: Complete");
}

export fn event(ev: [*c]const sapp.Event) void {
    if (ev.*.type == .CHAR) {
        if (ev.*.char_code == 13) {
            state.terminal_len = 0;
        } else if (ev.*.char_code == 8 or ev.*.char_code == 127) {
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

    const width = sapp.widthf();
    const height = sapp.heightf();
    state.ui.begin(width, height);

    state.ui.text(20, 40, "SULKYOS v4.0.0 [STABLE]", .{ .r = 0.5, .g = 0.8, .b = 1.0, .a = 1.0 });
    state.ui.text(20, 70, "MD. ARSHAD", .{ .r = 1.0, .g = 1.0, .b = 1.0, .a = 1.0 });
    
    state.ui.text(20, height - 40, "> ", .{ .r = 0.0, .g = 1.0, .b = 0.0, .a = 1.0 });
    state.ui.text(40, height - 40, state.terminal_input[0..state.terminal_len], .{ .r = 1.0, .g = 1.0, .b = 1.0, .a = 1.0 });

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
        .width = 1024,
        .height = 768,
        .window_title = "SulkyOS v4.0",
        .html5 = .{ .canvas_selector = "#canvas" },
    });
}
