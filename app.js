// Initial Setup for 3D Background
const initThreeJS = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Hypnotic Golden Particle Sphere (Icosahedron base)
    const geometry = new THREE.IcosahedronGeometry(2, 2); // optimized detail for mobile
    const material = new THREE.PointsMaterial({
        color: 0xd4af37, // Gold
        size: 0.02,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const sphere = new THREE.Points(geometry, material);
    scene.add(sphere);

    // Inner subtle glowing core
    const coreGeometry = new THREE.IcosahedronGeometry(1.8, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x332200,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    camera.position.z = 5;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2);
        mouseY = (e.clientY - window.innerHeight / 2);
    });

    const animate = () => {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        // Smooth slow hypnotic rotation
        sphere.rotation.y += 0.002;
        sphere.rotation.x += 0.001;
        
        core.rotation.y -= 0.001;
        core.rotation.x -= 0.0015;

        // Interactive sway
        sphere.rotation.y += 0.02 * (targetX - sphere.rotation.y);
        sphere.rotation.x += 0.02 * (targetY - sphere.rotation.x);

        renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};


document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize 3D Canvas
    initThreeJS();

    // DOM Elements
    const landingPage = document.getElementById('landing-page');
    const startBtn = document.getElementById('start-btn');
    const introView = document.getElementById('intro-view');
    const bgMusic = document.getElementById('bg-music');
    
    const vid1 = document.getElementById('vid1');
    const vid2 = document.getElementById('vid2');
    const introUi = document.getElementById('intro-ui');
    const goDashboardBtn = document.getElementById('go-dashboard-btn');

    // Restore audio time if user came back from dashboard
    const savedTime = localStorage.getItem('audioCurrentTime');
    if (savedTime && bgMusic) {
        bgMusic.currentTime = parseFloat(savedTime);
    }

    // 2. Luxury Landing Page -> Start Video
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // Fade out landing page and canvas
            landingPage.style.opacity = '0';
            const canvas = document.getElementById('bg-canvas');
            if(canvas) canvas.style.opacity = '0';

            setTimeout(() => {
                landingPage.classList.add('hidden');
                if(canvas) canvas.classList.add('hidden');
                
                // Show intro view
                introView.classList.remove('hidden');
                
                // Play audio and video
                if (bgMusic) bgMusic.play().catch(e => console.log("Audio block:", e));
                if (vid1) {
                    vid1.playbackRate = 1.4; // Speed up video 1 slightly
                    vid1.play().catch(e => console.log("Video block:", e));
                }
            }, 300); // 0.3 second extremely fast transition
        });
    }

    // Save audio time before navigating to dashboard
    if (goDashboardBtn) {
        goDashboardBtn.addEventListener('click', () => {
            if (bgMusic) {
                localStorage.setItem('audioCurrentTime', bgMusic.currentTime);
            }
        });
    }

    // 3. Video Sequence Logic (vid1 ends -> loop vid2)
    if (vid1 && vid2) {
        vid1.addEventListener('ended', () => {
            // Hide video 1
            vid1.style.opacity = '0';
            setTimeout(() => vid1.classList.add('hidden'), 1500);
            
            // Show and play video 2
            vid2.classList.remove('hidden');
            vid2.style.opacity = '0';
            
            // Fade in video 2
            setTimeout(() => {
                vid2.style.opacity = '1';
                vid2.play().catch(e => console.log(e));
            }, 100);
            
            // Show Intro UI (Vizitka link)
            setTimeout(() => {
                if(introUi) introUi.classList.remove('hidden');
            }, 500);
        });
    }
});
