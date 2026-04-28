const std = @import("std");

pub const Node = struct {
    x: f32,
    y: f32,
    vx: f32 = 0,
    vy: f32 = 0,
};

pub const Link = struct {
    source: usize,
    target: usize,
};

pub const Simulation = struct {
    nodes: []Node,
    links: []Link,
    width: f32,
    height: f32,

    pub fn init(allocator: std.mem.Allocator, node_count: usize, links: []Link, width: f32, height: f32) !Simulation {
        const nodes = try allocator.alloc(Node, node_count);
        var prng = std.Random.DefaultPrng.init(0);
        const random = prng.random();
        
        for (nodes) |*node| {
            node.* = .{
                .x = random.float(f32) * width,
                .y = random.float(f32) * height,
            };
        }

        return Simulation{
            .nodes = nodes,
            .links = links,
            .width = width,
            .height = height,
        };
    }

    pub fn update(self: *Simulation, dt: f32) void {
        const strength: f32 = -100.0;
        const link_strength: f32 = 0.05;
        const friction: f32 = 0.95;

        // Repulsion
        for (0..self.nodes.len) |i| {
            for (i + 1..self.nodes.len) |j| {
                const dx = self.nodes[j].x - self.nodes[i].x;
                const dy = self.nodes[j].y - self.nodes[i].y;
                const dist_sq = dx * dx + dy * dy + 0.1;
                const force = strength / dist_sq;
                self.nodes[i].vx += dx * force;
                self.nodes[i].vy += dy * force;
                self.nodes[j].vx -= dx * force;
                self.nodes[j].vy -= dy * force;
            }
        }

        // Link forces
        for (self.links) |link| {
            const dx = self.nodes[link.target].x - self.nodes[link.source].x;
            const dy = self.nodes[link.target].y - self.nodes[link.source].y;
            const dist = @sqrt(dx * dx + dy * dy + 0.1);
            const force = (dist - 30.0) * link_strength;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            self.nodes[link.source].vx += fx;
            self.nodes[link.source].vy += fy;
            self.nodes[link.target].vx -= fx;
            self.nodes[link.target].vy -= fy;
        }

        // Center force
        for (self.nodes) |*node| {
            node.vx += (self.width / 2.0 - node.x) * 0.001;
            node.vy += (self.height / 2.0 - node.y) * 0.001;
        }

        // Apply velocity
        for (self.nodes) |*node| {
            node.x += node.vx * dt;
            node.y += node.vy * dt;
            node.vx *= friction;
            node.vy *= friction;
        }
    }
};
