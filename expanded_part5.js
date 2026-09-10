/* ============================================================
   EXPANDED COMBAT ANIMATIONS - Visual Effect System
   ============================================================ */
const CombatAnimations = {
    particles: [],
    screenEffects: [],
    shakeIntensity: 0,
    shakeDuration: 0,
    flashColor: null,
    flashDuration: 0,
    animationQueue: [],
    isAnimating: false,
    currentAnimation: null,
    animationTimer: 0,
    attackSlash: { active: false, x: 0, y: 0, angle: 0, progress: 0 },

    queueAnimation(type, target, params) {
        this.animationQueue.push({ type: type, target: target, params: params || {} });
        if (!this.isAnimating) this.processQueue();
    },

    processQueue() {
        if (this.animationQueue.length === 0) {
            this.isAnimating = false;
            this.currentAnimation = null;
            return;
        }
        this.isAnimating = true;
        this.currentAnimation = this.animationQueue.shift();
        this.animationTimer = 0;
        this.startAnimation(this.currentAnimation);
    },

    startAnimation(anim) {
        switch (anim.type) {
            case 'slash': this.startSlashAnim(anim); break;
            case 'slash_wide': this.startWideSlashAnim(anim); break;
            case 'spin': this.startSpinAnim(anim); break;
            case 'storm': this.startStormAnim(anim); break;
            case 'bash': this.startBashAnim(anim); break;
            case 'fireball': this.startProjectileAnim(anim, '#ff4444'); break;
            case 'ice_shard': this.startProjectileAnim(anim, '#44ccff'); break;
            case 'meteor': this.startMeteorAnim(anim); break;
            case 'inferno': this.startInfernoAnim(anim); break;
            case 'blizzard': this.startBlizzardAnim(anim); break;
            case 'frozen_lance': this.startProjectileAnim(anim, '#88ddff'); break;
            case 'absolute_zero': this.startAbsoluteZeroAnim(anim); break;
            case 'backstab': this.startBackstabAnim(anim); break;
            case 'shadow_strike': this.startShadowStrikeAnim(anim); break;
            case 'poison_slash': this.startPoisonSlashAnim(anim); break;
            case 'assassinate': this.startAssassinateAnim(anim); break;
            case 'missile': this.startMissileAnim(anim); break;
            case 'burst': this.startBurstAnim(anim); break;
            case 'heal': this.startHealAnim(anim); break;
            case 'fire_storm': this.startFireStormAnim(anim); break;
            case 'lucky': this.startLuckyAnim(anim); break;
            case 'critical': this.startCriticalAnim(anim); break;
            default: this.animationTimer = 1.0; break;
        }
    },

    startSlashAnim(anim) {
        this.attackSlash.active = true;
        this.attackSlash.x = 300;
        this.attackSlash.y = 200;
        this.attackSlash.angle = -45;
        this.attackSlash.progress = 0;
        this.spawnParticles(300, 200, '#c9a959', 8, 'burst');
        this.shakeScreen(4, 0.2);
    },

    startWideSlashAnim(anim) {
        this.attackSlash.active = true;
        this.attackSlash.x = 250;
        this.attackSlash.y = 180;
        this.attackSlash.angle = -90;
        this.attackSlash.progress = 0;
        this.spawnParticles(250, 180, '#c9a959', 12, 'arc');
        this.spawnParticles(350, 180, '#c9a959', 12, 'arc');
        this.shakeScreen(6, 0.3);
    },

    startSpinAnim(anim) {
        this.spawnParticles(300, 200, '#c9a959', 20, 'circle');
        this.shakeScreen(8, 0.4);
    },

    startStormAnim(anim) {
        for (var i = 0; i < 5; i++) {
            var ox = (Math.random() - 0.5) * 200;
            var oy = (Math.random() - 0.5) * 100;
            this.spawnParticles(300 + ox, 200 + oy, '#c9a959', 6, 'burst');
        }
        this.shakeScreen(10, 0.5);
    },

    startBashAnim(anim) {
        this.spawnParticles(300, 200, '#6b9fff', 10, 'burst');
        this.shakeScreen(6, 0.3);
    },

    startProjectileAnim(anim, color) {
        var startX = 200, startY = 250, endX = 500, endY = 200;
        this.spawnParticles(startX, startY, color, 5, 'trail');
        var steps = 10;
        for (var i = 0; i < steps; i++) {
            var t = i / steps;
            this.spawnParticles(startX + (endX - startX) * t, startY + (endY - startY) * t, color, 3, 'fade');
        }
        this.spawnParticles(endX, endY, color, 15, 'burst');
        this.shakeScreen(4, 0.2);
    },

    startMeteorAnim(anim) {
        var startX = 400, startY = -50, endX = 400, endY = 200;
        for (var i = 0; i < 20; i++) {
            var t = i / 20;
            this.spawnParticles(startX + (endX - startX) * t, startY + (endY - startY) * t, '#ff4444', 4, 'trail');
            this.spawnParticles(startX + (endX - startX) * t + (Math.random()-0.5)*40, startY + (endY - startY) * t, '#ffaa44', 2, 'fade');
        }
        this.spawnParticles(endX, endY, '#ff4444', 30, 'explosion');
        this.shakeScreen(12, 0.6);
        this.triggerFlash('#ff6622', 0.3);
    },

    startInfernoAnim(anim) {
        for (var i = 0; i < 40; i++) {
            var x = 200 + Math.random() * 400;
            var y = 150 + Math.random() * 200;
            this.spawnParticles(x, y, i % 2 === 0 ? '#ff4444' : '#ff8844', 5, 'rise');
        }
        this.shakeScreen(14, 0.7);
        this.triggerFlash('#ff4400', 0.4);
    },

    startBlizzardAnim(anim) {
        for (var i = 0; i < 50; i++) {
            this.spawnParticles(100 + Math.random() * 600, -20 + Math.random() * 50, '#aaddff', 3, 'snow');
        }
        this.triggerFlash('#4488cc', 0.3);
    },

    startAbsoluteZeroAnim(anim) {
        this.triggerFlash('#0044aa', 0.5);
        this.shakeScreen(16, 0.8);
        for (var i = 0; i < 60; i++) {
            this.spawnParticles(150 + Math.random() * 500, 100 + Math.random() * 300, i % 3 === 0 ? '#ffffff' : '#88ccff', 4, 'freeze');
        }
    },

    startBackstabAnim(anim) {
        this.spawnParticles(500, 200, '#aa44ff', 10, 'burst');
        this.spawnParticles(500, 200, '#c9a959', 5, 'burst');
        this.shakeScreen(5, 0.2);
    },

    startShadowStrikeAnim(anim) {
        for (var i = 0; i < 15; i++) {
            this.spawnParticles(300 + (Math.random() - 0.5) * 100, 200 + (Math.random() - 0.5) * 100, '#aa44ff', 3, 'fade');
        }
        this.spawnParticles(450, 200, '#aa44ff', 12, 'burst');
        this.shakeScreen(6, 0.3);
    },

    startPoisonSlashAnim(anim) {
        this.spawnParticles(300, 200, '#44aa44', 8, 'burst');
        for (var i = 0; i < 10; i++) {
            this.spawnParticles(400 + (Math.random() - 0.5) * 80, 200 + (Math.random() - 0.5) * 80, '#228822', 3, 'drip');
        }
    },

    startAssassinateAnim(anim) {
        this.triggerFlash('#aa44ff', 0.15);
        this.spawnParticles(450, 200, '#ff4444', 15, 'burst');
        this.shakeScreen(10, 0.3);
    },

    startMissileAnim(anim) {
        for (var i = 0; i < 3; i++) {
            this.spawnParticles(180 + i * 20, 250, '#d4a8ff', 4, 'trail');
        }
        this.spawnParticles(450, 200, '#d4a8ff', 10, 'burst');
    },

    startBurstAnim(anim) {
        this.spawnParticles(400, 200, '#d4a8ff', 25, 'explosion');
        this.shakeScreen(8, 0.4);
    },

    startHealAnim(anim) {
        for (var i = 0; i < 20; i++) {
            this.spawnParticles(200 + Math.random() * 100, 300 - Math.random() * 200, '#44ff44', 2, 'rise');
        }
    },

    startFireStormAnim(anim) {
        for (var i = 0; i < 30; i++) {
            this.spawnParticles(200 + Math.random() * 400, 150 + Math.random() * 200, i % 2 === 0 ? '#ff4444' : '#ff8844', 4, 'firefly');
        }
        this.triggerFlash('#ff4400', 0.3);
        this.shakeScreen(10, 0.5);
    },

    startLuckyAnim(anim) {
        this.spawnParticles(300, 200, '#c9a959', 15, 'sparkle');
    },

    startCriticalAnim(anim) {
        this.triggerFlash('#ffffff', 0.1);
        this.spawnParticles(400, 200, '#ff4444', 20, 'burst');
        this.spawnParticles(400, 200, '#c9a959', 10, 'sparkle');
        this.shakeScreen(12, 0.4);
    },

    spawnParticles(x, y, color, count, type) {
        for (var i = 0; i < count; i++) {
            var p = {
                x: x, y: y, vx: 0, vy: 0,
                life: 1.0, decay: 0.02 + Math.random() * 0.03,
                size: 2 + Math.random() * 4, color: color,
                type: type, gravity: 0,
                angle: Math.random() * Math.PI * 2,
                speed: 1 + Math.random() * 3, alpha: 1.0
            };
            if (type === 'burst' || type === 'explosion') {
                p.vx = Math.cos(p.angle) * p.speed * 3;
                p.vy = Math.sin(p.angle) * p.speed * 3;
            } else if (type === 'rise') {
                p.vx = (Math.random() - 0.5) * 0.5;
                p.vy = -1 - Math.random() * 2;
            } else if (type === 'trail') {
                p.vx = (Math.random() - 0.5) * 0.5;
                p.vy = (Math.random() - 0.5) * 0.5;
                p.decay = 0.05;
            } else if (type === 'snow') {
                p.vx = (Math.random() - 0.5) * 0.5;
                p.vy = 0.5 + Math.random();
                p.decay = 0.005;
            } else if (type === 'firefly') {
                p.vx = (Math.random() - 0.5) * 1.5;
                p.vy = -Math.random() * 2;
                p.decay = 0.01;
                p.gravity = -0.02;
            } else if (type === 'sparkle') {
                p.vx = (Math.random() - 0.5) * 2;
                p.vy = -Math.random() * 2;
                p.size = 1 + Math.random() * 3;
                p.decay = 0.02;
            } else if (type === 'freeze') {
                p.vx = (Math.random() - 0.5) * 0.3;
                p.vy = (Math.random() - 0.5) * 0.3;
                p.decay = 0.008;
                p.size = 3 + Math.random() * 5;
            } else if (type === 'drip') {
                p.vx = (Math.random() - 0.5) * 0.3;
                p.vy = 0.5 + Math.random();
                p.gravity = 0.05;
                p.size = 2 + Math.random() * 3;
                p.decay = 0.015;
            } else if (type === 'circle') {
                var a = (i / count) * Math.PI * 2;
                p.vx = Math.cos(a) * 3;
                p.vy = Math.sin(a) * 3;
                p.size = 3;
            } else if (type === 'arc') {
                var ang = (i / count) * Math.PI - Math.PI / 2;
                p.vx = Math.cos(ang) * 4;
                p.vy = Math.sin(ang) * 2;
                p.size = 3;
            }
            this.particles.push(p);
        }
    },

    shakeScreen(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
    },

    triggerFlash(color, duration) {
        this.flashColor = color;
        this.flashDuration = duration;
    },

    update(dt) {
        this.animationTimer += dt;
        if (this.currentAnimation && this.animationTimer >= 0.8) {
            this.processQueue();
        }
        if (this.attackSlash.active) {
            this.attackSlash.progress += dt * 5;
            if (this.attackSlash.progress >= 1) this.attackSlash.active = false;
        }
        if (this.shakeDuration > 0) {
            this.shakeDuration -= dt;
            if (this.shakeDuration <= 0) this.shakeIntensity = 0;
        }
        if (this.flashDuration > 0) {
            this.flashDuration -= dt;
            if (this.flashDuration <= 0) this.flashColor = null;
        }
        for (var i = this.particles.length - 1; i >= 0; i--) {
            var p = this.particles[i];
            p.x += p.vx; p.y += p.vy; p.vy += p.gravity;
            p.life -= p.decay; p.alpha = Math.max(0, p.life);
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    },

    render(cx) {
        if (this.shakeDuration > 0) {
            var intensity = this.shakeIntensity * (this.shakeDuration / 0.5);
            cx.save();
            cx.translate((Math.random() - 0.5) * intensity, (Math.random() - 0.5) * intensity);
        }
        if (this.flashColor && this.flashDuration > 0) {
            cx.globalAlpha = Math.min(1, this.flashDuration * 2);
            cx.fillStyle = this.flashColor;
            cx.fillRect(0, 0, CANVAS_W, CANVAS_H);
            cx.globalAlpha = 1;
        }
        for (var i = 0; i < this.particles.length; i++) {
            var p = this.particles[i];
            cx.globalAlpha = p.alpha;
            cx.fillStyle = p.color;
            cx.beginPath();
            cx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            cx.fill();
        }
        cx.globalAlpha = 1;
        if (this.attackSlash.active) this.renderSlash(cx);
        if (this.shakeDuration > 0) cx.restore();
    },

    renderSlash(cx) {
        var progress = this.attackSlash.progress;
        var x = this.attackSlash.x;
        var y = this.attackSlash.y;
        cx.save();
        cx.translate(x, y);
        cx.rotate(this.attackSlash.angle * Math.PI / 180 + progress * Math.PI);
        cx.globalAlpha = 1 - progress;
        cx.strokeStyle = '#c9a959';
        cx.lineWidth = 4;
        cx.beginPath();
        var len = 80 * progress;
        cx.moveTo(-len, 0);
        cx.quadraticCurveTo(0, -30 * progress, len, 0);
        cx.stroke();
        cx.strokeStyle = '#ffffff';
        cx.lineWidth = 2;
        cx.beginPath();
        cx.moveTo(-len * 0.7, 0);
        cx.quadraticCurveTo(0, -20 * progress, len * 0.7, 0);
        cx.stroke();
        cx.restore();
    },

    clear() {
        this.particles = [];
        this.animationQueue = [];
        this.isAnimating = false;
        this.currentAnimation = null;
        this.attackSlash.active = false;
        this.shakeDuration = 0;
        this.flashDuration = 0;
    }
};
