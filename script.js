<script>
        // --- 1. NAVEGAÇÃO DE ABAS ---
        function abrirAba(idAba, linkClicado) {
            document.querySelectorAll('.aba-conteudo').forEach(aba => {
                aba.classList.remove('ativa');
            });
            document.getElementById(idAba).classList.add('ativa');

            if (linkClicado) {
                document.querySelectorAll('.nav-lados a').forEach(link => {
                    link.classList.remove('menu-ativo');
                });
                linkClicado.classList.add('menu-ativo');
            } else {
                document.querySelectorAll('.nav-lados a').forEach(link => {
                    link.classList.remove('menu-ativo');
                });
                if (idAba === 'aba-home') {
                    document.querySelector('.nav-esquerda a:first-child').classList.add('menu-ativo');
                }
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function irParaEnsaio(idCategoria, idEnsaio) {
            abrirAba(idCategoria, null);
            setTimeout(() => {
                const elemento = document.getElementById(idEnsaio);
                if (elemento) {
                    const y = elemento.getBoundingClientRect().top + window.scrollY - 120;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 100);
        }

        // --- 2. LÓGICA DO SLIDER DA HOME ---
        let indiceSlide = 0;
        let timerSlide;

        function mostrarSlide(n) {
            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.dot');
            if (slides.length === 0) return;

            if (n >= slides.length) indiceSlide = 0;
            if (n < 0) indiceSlide = slides.length - 1;

            slides.forEach(slide => slide.classList.remove('ativa'));
            dots.forEach(dot => dot.classList.remove('ativo'));

            slides[indiceSlide].classList.add('ativa');
            dots[indiceSlide].classList.add('ativo');
        }

        function mudarSlide(n) {
            indiceSlide += n;
            mostrarSlide(indiceSlide);
            reiniciarTimerSlide();
        }

        function irParaSlide(n) {
            indiceSlide = n;
            mostrarSlide(indiceSlide);
            reiniciarTimerSlide();
        }

        function reiniciarTimerSlide() {
            clearInterval(timerSlide);
            timerSlide = setInterval(() => mudarSlide(1), 5000); // Muda a cada 5 segundos
        }

        // --- 3. LÓGICA DO LIGHTBOX COM GALERIA ---
        let fotosLightboxAtuais = [];
        let indiceFotoAtual = 0;

        function abrirLightbox(elementoClicado) {
            // Descobre qual grupo de fotos foi clicado
            const containerPai = elementoClicado.closest('.linha-6-fotos');
            
            if (containerPai) {
                // Pega todas as fotos daquele ensaio específico
                fotosLightboxAtuais = Array.from(containerPai.querySelectorAll('img'));
                indiceFotoAtual = fotosLightboxAtuais.indexOf(elementoClicado);
            } else {
                // Caso clique em uma foto isolada
                fotosLightboxAtuais = [elementoClicado];
                indiceFotoAtual = 0;
            }

            atualizarImagemLightbox();
            document.getElementById("meuLightbox").style.display = "flex";
            document.body.style.overflow = "hidden"; // Impede rolagem do fundo
        }

        function mudarFotoLightbox(n, event) {
            if (event) event.stopPropagation(); // Impede que o clique feche o lightbox
            
            indiceFotoAtual += n;
            
            // Lógica de Loop (se passar da última, volta pra primeira)
            if (indiceFotoAtual >= fotosLightboxAtuais.length) {
                indiceFotoAtual = 0;
            } else if (indiceFotoAtual < 0) {
                indiceFotoAtual = fotosLightboxAtuais.length - 1;
            }
            
            atualizarImagemLightbox();
        }

        function atualizarImagemLightbox() {
            const imgEl = document.getElementById("imgExpandida");
            imgEl.style.opacity = 0; // Efeito de transição suave
            
            setTimeout(() => {
                imgEl.src = fotosLightboxAtuais[indiceFotoAtual].src;
                imgEl.style.opacity = 1;
            }, 150);
        }

        function fecharLightbox() {
            document.getElementById("meuLightbox").style.display = "none";
            document.body.style.overflow = "auto"; // Volta a rolagem do fundo
        }

        // Clicar fora da foto fecha o lightbox
        document.getElementById("meuLightbox").addEventListener("click", function(evento) {
            fecharLightbox();
        });

        // Suporte a teclado (ESC para fechar, Setas para navegar)
        document.addEventListener('keydown', function(event) {
            if (document.getElementById("meuLightbox").style.display === "flex") {
                if (event.key === "Escape") fecharLightbox();
                if (event.key === "ArrowRight") mudarFotoLightbox(1);
                if (event.key === "ArrowLeft") mudarFotoLightbox(-1);
            }
        });

        // --- 4. INICIALIZAÇÃO E ANIMAÇÕES DE SCROLL ---
        document.addEventListener('DOMContentLoaded', function() {
            // Inicia o Slider
            mostrarSlide(indiceSlide);
            reiniciarTimerSlide();

            // Marca a Home como ativa no menu
            document.querySelector('.nav-esquerda a:first-child').classList.add('menu-ativo');

            // Inicia o observador de Scroll
            const observador = new IntersectionObserver((entradas) => {
                entradas.forEach((entrada) => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add('elemento-mostrar');
                        observador.unobserve(entrada.target); 
                    }
                });
            }, { threshold: 0.15 });

            // Anima apenas o portfólio e sobre mim
            const elementosParaAnimar = document.querySelectorAll('.cartao-ensaio, .linha-6-fotos img, .sobre-mim-conteudo, .btn-contato');
            elementosParaAnimar.forEach((elemento) => {
                elemento.classList.add('elemento-oculto');
                observador.observe(elemento);
            });
        });
    </script>