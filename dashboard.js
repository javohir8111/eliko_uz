document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 3D Luxury Card Tilt & Extrusion Effect (Gyroscope & Mouse)
    const cardWrap = document.getElementById('card-container');
    const card = document.getElementById('luxury-card');
    const glossyOverlay = document.querySelector('.glossy-overlay');
    
    if (cardWrap && card) {
        // Desktop Mouse Tilt
        cardWrap.addEventListener('mousemove', (e) => {
            const rect = cardWrap.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const x = e.clientX - centerX;
            const y = e.clientY - centerY;
            
            const rotateX = (y / (rect.height / 2)) * -10; // Max 10 deg tilt
            const rotateY = (x / (rect.width / 2)) * 10;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Dynamic glossy reflection
            const glareX = ((e.clientX - rect.left) / rect.width) * 100;
            const glareY = ((e.clientY - rect.top) / rect.height) * 100;
            glossyOverlay.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
        });
        
        cardWrap.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg)`;
            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            glossyOverlay.style.background = `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
            glossyOverlay.style.transition = 'background 0.6s ease';
        });
        
        cardWrap.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
            glossyOverlay.style.transition = 'none';
        });

        // Mobile Gyroscope Tilt
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                const tiltX = Math.min(Math.max(e.beta - 45, -20), 20); // forward/back (-20 to 20)
                const tiltY = Math.min(Math.max(e.gamma, -20), 20); // left/right (-20 to 20)
                
                card.style.transform = `rotateX(${tiltX * -0.5}deg) rotateY(${tiltY * 0.5}deg)`;
                
                const glareX = 50 + tiltY * 2;
                const glareY = 50 + tiltX * 2;
                glossyOverlay.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;
            });
        }
    }

    // 2. Premium "Golden Dust / Silk" Three.js Background
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create flowing particle wave
    const particlesCount = 1500; // Dense dust
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    for(let i = 0; i < particlesCount; i++) {
        const x = (Math.random() - 0.5) * 15;
        const y = (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 10;
        
        posArray[i*3] = x;
        posArray[i*3+1] = y;
        posArray[i*3+2] = z;

        scaleArray[i] = Math.random();
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Custom shader material for glowing dust that pulses
    const material = new THREE.PointsMaterial({
        size: 0.03,
        color: 0xd4af37, // Gold
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);
    
    camera.position.z = 4;
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });
    
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        // Silk-like flow effect
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;
        
        // Interactive shift
        particlesMesh.position.x += (mouseX * 0.5 - particlesMesh.position.x) * 0.05;
        particlesMesh.position.y += (-mouseY * 0.5 - particlesMesh.position.y) * 0.05;
        
        // Wavy movement for individual vertices
        const positions = geometry.attributes.position.array;
        for(let i = 0; i < particlesCount; i++) {
            const ix = i * 3;
            // Add a subtle wave to the Y axis based on X and Z
            positions[ix+1] += Math.sin(elapsedTime + positions[ix]*2)*0.002;
        }
        geometry.attributes.position.needsUpdate = true;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
