const std = @import("std");
const sokol = @import("sokol");

pub fn build(b: *std.Build) !void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const dep_sokol = b.dependency("sokol", .{
        .target = target,
        .optimize = optimize,
    });

    const shaders = try sokol.shdc.createSourceFile(b, .{
        .shdc_dep = dep_sokol.builder.dependency("shdc", .{}),
        .input = "src/shaders.glsl",
        .output = "src/shaders.glsl.zig",
        .slang = .{
            .glsl300es = true,
            .metal_macos = true,
        },
    });

    const lib_name = "sulkyos";
    const root_module = b.createModule(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    const exe = if (target.result.cpu.arch.isWasm())
        b.addLibrary(.{
            .name = lib_name,
            .root_module = root_module,
        })
    else
        b.addExecutable(.{
            .name = lib_name,
            .root_module = root_module,
        });

    if (!target.result.cpu.arch.isWasm()) {
        exe.root_module.link_libc = true;
    }

    exe.root_module.addCSourceFile(.{
        .file = b.path("deps/stb_truetype.c"),
        .flags = &.{},
    });

    exe.root_module.addIncludePath(b.path("deps"));
    exe.step.dependOn(shaders);
    exe.root_module.addImport("shaders", b.createModule(.{
        .root_source_file = b.path("src/shaders.glsl.zig"),
    }));

    exe.root_module.addImport("sokol", dep_sokol.module("sokol"));

    if (!target.result.cpu.arch.isWasm()) {
        b.installArtifact(exe);
    }

    // WASM support
    if (target.result.cpu.arch.isWasm()) {
        const emsdk = dep_sokol.builder.dependency("emsdk", .{});
        exe.root_module.addSystemIncludePath(emsdk.path("upstream/emscripten/cache/sysroot/include"));

        const emscripten_link = try sokol.emLinkStep(b, .{
            .lib_main = @ptrCast(exe),
            .target = target,
            .optimize = optimize,
            .emsdk = emsdk,
            .use_webgl2 = true,
            .use_emmalloc = true,
            .use_filesystem = true,
            .shell_file_path = dep_sokol.builder.path("src/sokol/web/shell.html"),
        });
        b.getInstallStep().dependOn(&emscripten_link.step);
    }

    if (!target.result.cpu.arch.isWasm()) {
        const run_cmd = b.addRunArtifact(@ptrCast(exe));
        run_cmd.step.dependOn(b.getInstallStep());
        if (b.args) |args| {
            run_cmd.addArgs(args);
        }
        const run_step = b.step("run", "Run the app");
        run_step.dependOn(&run_cmd.step);
    }
}
