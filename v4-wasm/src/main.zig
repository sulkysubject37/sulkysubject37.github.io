const sokol = @import("sokol");
const sg = sokol.gfx;
const sapp = sokol.app;
const sglue = sokol.glue;

// External Emscripten functions for direct JS debug
extern fn emscripten_run_script(ptr: [*c]const u8) void;

const state = struct {
    var pass_action: sg.PassAction = .{};
};

export fn init() void {
    // Direct JS feedback - if you don't see this in console, ZIG IS NOT RUNNING
    emscripten_run_script("console.log('!!! ZIG INIT CALLED !!!')");
    
    sg.setup(.{
        .environment = sglue.environment(),
    });

    state.pass_action.colors[0] = .{
        .load_action = .CLEAR,
        .clear_value = .{ .r = 1.0, .g = 0.0, .b = 0.0, .a = 1.0 }, // Bright Red
    };
    
    emscripten_run_script("console.log('!!! GFX SETUP COMPLETE !!!')");
}

export fn frame() void {
    sg.beginPass(.{ .action = state.pass_action, .swapchain = sglue.swapchain() });
    sg.endPass();
    sg.commit();
}

export fn cleanup() void {
    sg.shutdown();
}

pub fn main() void {
    sapp.run(.{
        .init_cb = init,
        .frame_cb = frame,
        .cleanup_cb = cleanup,
        .width = 800,
        .height = 600,
        .window_title = "DEBUG BUILD",
    });
}
