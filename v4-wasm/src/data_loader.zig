const std = @import("std");

pub const PortfolioData = struct {
    about: struct {
        name: []const u8,
        title: []const u8,
        bio: []const u8,
        cruelBio: []const u8,
        location: []const u8,
        email: []const u8,
        social: struct {
            github: []const u8,
            linkedin: []const u8,
            twitter: []const u8,
            blog: []const u8,
        },
    },
    projects: []struct {
        title: []const u8,
        tech: []const u8,
        description: []const u8,
        cruelDescription: []const u8,
        link: []const u8,
    },
    skills: [][]const u8,
    posts: []struct {
        title: []const u8,
        date: []const u8,
        summary: []const u8,
        link: []const u8,
    },
};

pub fn load(allocator: std.mem.Allocator, json_data: []const u8) !std.json.Parsed(PortfolioData) {
    return std.json.parseFromSlice(PortfolioData, allocator, json_data, .{
        .ignore_unknown_fields = true,
    });
}
