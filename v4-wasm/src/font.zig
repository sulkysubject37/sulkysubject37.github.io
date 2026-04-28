const std = @import("std");
const sokol = @import("sokol");
const sg = sokol.gfx;

const stb = @cImport({
    @cInclude("stb_truetype.h");
});

pub const FontAtlas = struct {
    texture: sg.Image,
    sampler: sg.Sampler,
    char_data: [96]stb.stbtt_bakedchar, // ASCII 32..126
    width: i32,
    height: i32,

    pub fn init(font_data: []const u8, atlas_width: i32, atlas_height: i32) !FontAtlas {
        var atlas = FontAtlas{
            .texture = .{},
            .sampler = .{},
            .char_data = undefined,
            .width = atlas_width,
            .height = atlas_height,
        };

        const pixels = try std.heap.page_allocator.alloc(u8, @intCast(atlas_width * atlas_height));
        defer std.heap.page_allocator.free(pixels);

        const res = stb.stbtt_BakeFontBitmap(
            font_data.ptr,
            0,
            32.0, // font height
            pixels.ptr,
            atlas_width,
            atlas_height,
            32,
            96,
            &atlas.char_data,
        );

        if (res <= 0) return error.FontBakingFailed;

        atlas.texture = sg.makeImage(.{
            .width = atlas_width,
            .height = atlas_height,
            .pixel_format = .R8,
            .data = .{
                .mip_levels = [_]sg.Range{
                    .{ .ptr = pixels.ptr, .size = pixels.len },
                } ++ ([_]sg.Range{.{}} ** 15),
            },
        });

        atlas.sampler = sg.makeSampler(.{
            .min_filter = .LINEAR,
            .mag_filter = .LINEAR,
        });

        return atlas;
    }

    pub fn deinit(self: *FontAtlas) void {
        sg.destroyImage(self.texture);
        sg.destroySampler(self.sampler);
    }
};
