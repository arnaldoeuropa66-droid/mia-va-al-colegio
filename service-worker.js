// ============================================================
// 📦 SERVICE WORKER - Registro con auto-update mejorado
// ============================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js', {
            updateViaCache: 'none'  // ← Fuerza a no usar caché HTTP para el SW
        })
        .then((registration) => {
            console.log('📦 Service Worker registrado');

            // Forzar comprobación de actualización al arrancar
            registration.update().catch(() => {});

            // 🔄 Detectar nueva versión durante la sesión
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('🆕 Nueva versión del SW detectada');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // Hay una versión nueva lista para activar
                            console.log('✅ Nueva versión lista');
                            mostrarAvisoActualizacion(registration);
                        } else {
                            // Primera instalación
                            console.log('🎉 SW instalado por primera vez');
                        }
                    }
                });
            });

            // Si ya hay un SW esperando al arrancar, avisa
            if (registration.waiting) {
                console.log('⏳ Hay un SW esperando');
                mostrarAvisoActualizacion(registration);
            }

            // 🔁 Detecta cuando el SW toma el control tras la actualización
            let refrescando = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refrescando) {
                    refrescando = true;
                    console.log('🔄 Recargando con nueva versión...');
                    window.location.reload();
                }
            });
        })
        .catch((err) => {
            console.log('❌ Error al registrar SW:', err);
        });

        // 🔄 Comprobar actualizaciones cada 30 minutos
        setInterval(() => {
            navigator.serviceWorker.getRegistration().then((reg) => {
                if (reg) reg.update().catch(() => {});
            });
        }, 30 * 60 * 1000);

        // 📢 Escuchar mensajes del SW
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.tipo === 'NUEVA_VERSION') {
                console.log('📢 SW notifica versión:', event.data.version);
                mostrarAvisoActualizacion(null);
            }
        });
    });
}

// ============================================================
// 🔔 Aviso visual de nueva versión
// ============================================================
function mostrarAvisoActualizacion(registration) {
    // Evita duplicados
    if (document.getElementById('avisoActualizacion')) return;

    const aviso = document.createElement('div');
    aviso.id = 'avisoActualizacion';
    aviso.innerHTML = `
        <span style="font-size:1.6rem;">🎉</span>
        <span style="flex:1; line-height:1.3;">
            <strong>¡Nueva versión de Mia!</strong><br>
            <small style="color:#888;">Pulsa para actualizar</small>
        </span>
        <button id="btnActualizar" style="
            background: linear-gradient(135deg, #6BCB77, #4CAF50);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 10px 20px;
            font-family: 'Quicksand', sans-serif;
            font-weight: 700;
            font-size: 0.9rem;
            cursor: pointer;
            box-shadow: 0 3px 0 #2E7D32;
            transition: all 0.15s;
        ">🔄 Actualizar</button>
    `;
    aviso.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #fff;
        color: #333;
        padding: 14px 20px;
        border-radius: 50px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.25);
        font-family: 'Quicksand', sans-serif;
        font-weight: 600;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 14px;
        z-index: 99999;
        max-width: 92%;
        min-width: 280px;
        border: 3px solid #FFD93D;
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;

    document.body.appendChild(aviso);

    // Animación de entrada
    requestAnimationFrame(() => {
        setTimeout(() => {
            aviso.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
    });

    const btn = document.getElementById('btnActualizar');
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 5px 0 #2E7D32';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '0 3px 0 #2E7D32';
    });

    btn.addEventListener('click', () => {
        btn.textContent = '⏳ Actualizando...';
        btn.disabled = true;

        // Envía mensaje al SW para activación inmediata
        navigator.serviceWorker.ready.then((reg) => {
            if (reg.waiting) {
                reg.waiting.postMessage({ tipo: 'SKIP_WAITING' });
            }
        });

        // Por si acaso, recarga tras 2s
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    });

    // Auto-actualización tras 30s si el usuario no hace nada
    setTimeout(() => {
        if (document.getElementById('avisoActualizacion')) {
            console.log('⏰ Auto-actualizando tras 30s...');
            btn.click();
        }
    }, 30000);
}