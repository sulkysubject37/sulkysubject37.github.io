const std = @import("std");
const sokol = @import("sokol");
const sg = sokol.gfx;
const sgl = sokol.gl;
const font = @import("font.zig");

pub const Rect = struct {
    x: f32,
    y: f32,
    w: f32,
    h: f32,
};

pub const Color = struct {
    r: f32,
    g: f32,
    b: f32,
    a: f32,
};

pub const UIState = struct {
    atlas: *font.FontAtlas,
    screen_width: f32,
    screen_height: f32,
    mouse_x: f32,
    mouse_y: f32,
    is_cruel_mode: bool = false,

    pub fn begin(self: *UIState, width: f32, height: f32) void {
        self.screen_width = width;
        self.screen_height = height;
        sgl.defaults();
        sgl.matrixModeProjection();
        sgl.ortho(0.0, width, height, 0.0, -1.0, 1.0);
    }

    pub fn end(_: *UIState) void {
        sgl.draw();
    }

    pub fn text(self: *UIState, x: f32, y: f32, str: []const u8, color: Color) void {
        sgl.enableTexture();
        sgl.texture(sg.View{ .id = self.atlas.texture.id }, self.atlas.sampler);
        sgl.beginQuads();
        sgl.c4f(color.r, color.g, color.b, color.a);
        
        var cur_x = x;
        const cur_y = y;

        for (str) |c| {
            if (c < 32 or c > 126) continue;
            const char = self.atlas.char_data[c - 32];
            
            const x0 = cur_x + char.xoff;
            const y0 = cur_y + char.yoff;
            const x1 = x0 + @as(f32, @floatFromInt(char.x1 - char.x0));
            const y1 = y0 + @as(f32, @floatFromInt(char.y1 - char.y0));

            const tu0 = @as(f32, @floatFromInt(char.x0)) / @as(f32, @floatFromInt(self.atlas.width));
            const tv0 = @as(f32, @floatFromInt(char.y0)) / @as(f32, @floatFromInt(self.atlas.height));
            const tu1 = @as(f32, @floatFromInt(char.x1)) / @as(f32, @floatFromInt(self.atlas.width));
            const tv1 = @as(f32, @floatFromInt(char.y1)) / @as(f32, @floatFromInt(self.atlas.height));

            sgl.v2fT2f(x0, y0, tu0, tv0);
            sgl.v2fT2f(x1, y0, tu1, tv0);
            sgl.v2fT2f(x1, y1, tu1, tv1);
            sgl.v2fT2f(x0, y1, tu0, tv1);

            cur_x += char.xadvance;
        }
        sgl.end();
        sgl.disableTexture();
    }

    // Measure-First Layout with Exclusion
    pub fn text_wrapped_with_exclusion(
        self: *UIState,
        x_start: f32,
        y_start: f32,
        max_width: f32,
        line_height: f32,
        str: []const u8,
        color: Color,
        exclusion_fn: *const fn (y: f32) Rect,
    ) void {
        var cur_y = y_start;
        var remaining = str;

        while (remaining.len > 0) {
            const exclusion = exclusion_fn(cur_y);
            const line_x = if (cur_y >= exclusion.y and cur_y <= exclusion.y + exclusion.h)
                exclusion.x + exclusion.w + 10.0
            else
                x_start;

            const line_max_w = max_width - (line_x - x_start);
            
            // Find how many words fit in line_max_w
            var break_idx: usize = 0;
            var line_w: f32 = 0.0;
            var i: usize = 0;
            while (i < remaining.len) : (i += 1) {
                const c = remaining[i];
                if (c == '\n') {
                    break_idx = i + 1;
                    break;
                }
                if (c < 32 or c > 126) continue;
                const char = self.atlas.char_data[c - 32];
                if (line_w + char.xadvance > line_max_w) {
                    if (break_idx == 0) break_idx = i; // force break
                    break;
                }
                line_w += char.xadvance;
                if (c == ' ') break_idx = i + 1;
            }
            if (break_idx == 0) break_idx = remaining.len;

            const line_str = remaining[0..break_idx];
            self.text(line_x, cur_y, line_str, color);

            remaining = remaining[break_idx..];
            cur_y += line_height;
        }
    }
};
