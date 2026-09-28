document.addEventListener('DOMContentLoaded', () => {

    // == Configuración de avatares disponibles ==
    // Nombres reales de archivo dentro de src/assets/
    const NOMBRES_AVATARES = [
        'AvatarAAL', 'AvatarAKA', 'AvatarCTH', 'AvatarIBE', 'AvatarMIX', 'AvatarVIV',
        'AvatarAAR', 'AvatarAVC', 'AvatarFDX(OrangeEdition)', 'AvatarKOR', 'AvatarPNM', 'AvatarVOL',
        'AvatarAFR', 'AvatarCGT', 'AvatarFDX(VioletEdition)', 'AvatarLFT', 'AvatarUPS',
        'AvatarAIC', 'AvatarCGX', 'AvatarGAP', 'AvatarMEX', 'AvatarUTD'
    ];

    // == Condifuracion de banderas por Aerolinea ==
    const PAIS_POR_AEROLINEA = {
        'AAL': 'United States', //American Airlines
        'AKA': 'United States', //Alaska Airlines
        'CTH': 'Hong Kong', //Cathay Pacific
        'IBE': 'Spain', //Iberia
        'MIX': 'Mexico', //Mexicana de Aviacion
        'VIV': 'Mexico', //Viva Aerobus (Sheinbuam's Version)
        'AAR': 'United States', //Atlas Air
        'AVC': 'Colombia', //Avianca
        'FDX': 'United States', //FedEx
        'KOR': 'Korea (Republic of)', //Korean Air
        'PNM': 'Panama', //Copa Airlines
        'VOL': 'Mexico', //Volaris
        'AFR': 'France', //Air France
        'CGT': 'Canada', //Cargojet
        'LFT': 'Germany', //Lufthansa
        'UPS': 'United States', //UPS
        'AIC': 'Canada', //Air Canada
        'CGX': 'Luxembourg', //Cargolux
        'MEX': 'Mexico', //Aeromexico
        'UTD': 'United States', //United Airlines
    };

    const avatares = NOMBRES_AVATARES.map(
        (nombre) => `src/assets/${nombre}.png`
    );

    // == Referencias al DOM ==
    const form = document.getElementById('profile-form');
    const avatarSelector = document.getElementById('avatar-selector');
    const inputName = document.getElementById('input-name');
    const inputBio = document.getElementById('input-bio');
    const inputColor = document.getElementById('input-color');

    const avatarPreview = document.getElementById('avatar-preview');
    const namePreview = document.getElementById('name-preview');
    const bioPreview = document.getElementById('bio-preview');
    const headerPreview = document.getElementById('preview-header');
    const badgePreview = document.getElementById('badge-preview');
    const inputBadge = document.getElementById('input-badge');

    const themeToggle = document.getElementById('theme-toggle');

    const viewCreate = document.getElementById('view-create');
    const viewGaleria = document.getElementById('view-galeria');
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryEmpty = document.getElementById('gallery-empty');
    const gallerySearch = document.getElementById('gallery-search');
    const navLinks = document.querySelectorAll('.nav-link');

    // == Buscador de GitHub ==
    const inputSearch = document.getElementById('github-search');
    const btnFetch = document.getElementById('btn-fetch');
    const apiStatus = document.getElementById('api-status');

    let avatarSeleccionado = avatares[0];

    // == Modo oscuro / claro ==
    function aplicarTema(modoOscuro) {
        document.body.classList.toggle('dark-mode', modoOscuro);
        if (themeToggle) {
            themeToggle.textContent = modoOscuro ? '☀️' : '🌙';
        }
        localStorage.setItem('gap_tema_oscuro', modoOscuro ? '1' : '0');
    }

    function inicializarTema() {
        const guardado = localStorage.getItem('gap_tema_oscuro');
        const prefiereOscuro =
            guardado === null
                ? window.matchMedia('(prefers-color-scheme: dark)').matches
                : guardado === '1';
        aplicarTema(prefiereOscuro);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const modoOscuroActivo = document.body.classList.contains('dark-mode');
            aplicarTema(!modoOscuroActivo);
        });
    }

    // == Construir selector de avatares ==
    function renderAvatarSelector() {
        avatarSelector.innerHTML = '';

        avatares.forEach((ruta, index) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'avatar-option';
            btn.dataset.src = ruta;
            btn.title = NOMBRES_AVATARES[index];
            if (index === 0) btn.classList.add('selected');

            const img = document.createElement('img');
            img.src = ruta;
            img.alt = NOMBRES_AVATARES[index];

            btn.appendChild(img);
            btn.addEventListener('click', () => seleccionarAvatar(btn, ruta));
            avatarSelector.appendChild(btn);
        });
    }

    function seleccionarAvatar(boton, ruta) {
        document
            .querySelectorAll('.avatar-option')
            .forEach((el) => el.classList.remove('selected'));

        boton.classList.add('selected');
        avatarSeleccionado = ruta;
        avatarPreview.src = ruta;

        const codigo = boton.title.replace('Avatar','').substring(0, 3);
        fetchPaisAerolinea(codigo);
    }

const fetchPaisAerolinea = async (codigo) => {
    const flagImg = document.getElementById('country-flag');
    const pais = PAIS_POR_AEROLINEA[codigo];

    if (!pais) {
        flagImg.hidden = true;
        return;
    }

    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: pais })
        });

        if (!response.ok) throw new Error('País no encontrado');
        const data = await response.json();

        if (data.error) throw new Error('Bandera no disponible');

        flagImg.src = data.data.flag;
        flagImg.alt = `Bandera de ${pais}`;
        flagImg.hidden = false;
    } catch (error) {
        console.error('Error al obtener bandera:', error);
        flagImg.hidden = true;
    }
};

    // == Actualización de la tarjeta en tiempo real ==
    function actualizarNombre() {
        const valor = inputName.value.trim();
        namePreview.textContent = valor || 'Nombre Apellido';
    }

    function actualizarBio() {
        const valor = inputBio.value.trim();
        bioPreview.textContent = valor || 'La biografía aparecerá aquí...';
    }

    function actualizarColor() {
        const color = inputColor.value;
        headerPreview.style.background =
            `linear-gradient(120deg, ${color}, #0b2447)`;
    }

    function actualizarBadge() {
        const tipo = inputBadge.value;
        if (!badgePreview) return;

        if (!tipo) {
            badgePreview.hidden = true;
            badgePreview.textContent = '';
            badgePreview.removeAttribute('data-tipo');
            return;
        }

        badgePreview.hidden = false;
        badgePreview.textContent = tipo;
        badgePreview.dataset.tipo = tipo;
    }

    // == Guardar perfil (localStorage) ==
    function guardarPerfil(evento) {
        evento.preventDefault();

        const perfil = {
            id: Date.now(),
            nombre: inputName.value.trim() || 'Nombre Apellido',
            bio: inputBio.value.trim() || 'La biografía aparecerá aquí...',
            color: inputColor.value,
            avatar: avatarSeleccionado,
            badge: inputBadge.value
        };

        const perfiles = JSON.parse(localStorage.getItem('gap_perfiles') || '[]');
        perfiles.push(perfil);
        localStorage.setItem('gap_perfiles', JSON.stringify(perfiles));

        form.reset();
        inputColor.value = '#3b82f6';
        actualizarNombre();
        actualizarBio();
        actualizarColor();
        actualizarBadge();
        seleccionarAvatar(
            avatarSelector.querySelector('.avatar-option'),
            avatares[0]
        );

        alert('¡Tarjeta guardada con éxito!');
    }

    // == API GitHub ==
    const fetchGitHubData = async (username) => {
        if (!username) return;
        apiStatus.textContent = 'Buscando usuario en GitHub...';
        apiStatus.className = 'status-msg status-loading';
        btnFetch.disabled = true;

        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error('Usuario no encontrado');
            const data = await response.json();

            // Nombre y bio van directo a los inputs del formulario
            inputName.value = data.name || data.login;
            inputBio.value = data.bio || 'Este usuario no tiene biografía pública.';
            actualizarNombre();
            actualizarBio();

            // La foto de GitHub reemplaza el avatar seleccionado
            avatarSeleccionado = data.avatar_url;
            avatarPreview.src = data.avatar_url;
            document.getElementById('country-flag').hidden = true;
            document
                .querySelectorAll('.avatar-option')
                .forEach((el) => el.classList.remove('selected'));

            apiStatus.textContent = '¡Datos cargados correctamente!';
            apiStatus.className = 'status-msg status-success';
        } catch (error) {
            apiStatus.textContent = error.message;
            apiStatus.className = 'status-msg status-error';
        } finally {
            btnFetch.disabled = false;
            setTimeout(() => { apiStatus.textContent = ''; }, 3000);
        }
    };

    // == API RandomUser ==
    const fetchPerfilAleatorio = async () => {
        const randomStatus = document.getElementById('random-status');
        const btnRandom = document.getElementById('btn-random');

        randomStatus.textContent = 'Generando perfil...';
        randomStatus.className = 'status-msg status-loading';
        btnRandom.disabled = true;

        try {
            const response = await fetch('https://randomuser.me/api/');
            if (!response.ok) throw new Error('No se pudo generar el perfil');
            const data = await response.json();
            const persona = data.results[0];

            inputName.value = `${persona.name.first} ${persona.name.last}`;
            actualizarNombre();

            inputBio.value = `${persona.location.city}, ${persona.location.country} · ${persona.email}`;
            actualizarBio();

            avatarSeleccionado = persona.picture.large;
            avatarPreview.src = persona.picture.large;
            document.getElementById('country-flag').hidden = true;
            document
                .querySelectorAll('.avatar-option')
                .forEach((el) => el.classList.remove('selected'));

            randomStatus.textContent = '¡Perfil generado!';
            randomStatus.className = 'status-msg status-success';
        } catch (error) {
            randomStatus.textContent = error.message;
            randomStatus.className = 'status-msg status-error';
        } finally {
            btnRandom.disabled = false;
            setTimeout(() => { randomStatus.textContent = ''; }, 3000);
        }
    };

    // == API BlueSky ==
    const fetchBlueskyData = async (handle) => {
    if (!handle) return;
    const bskyStatus = document.getElementById('bsky-status');
    const btnBsky = document.getElementById('btn-bsky');

    bskyStatus.textContent = 'Buscando usuario en Bluesky...';
    bskyStatus.className = 'status-msg status-loading';
    btnBsky.disabled = true;

    try {
        const limpio = handle.replace('@', '');
        const response = await fetch(
            `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(limpio)}`
        );
        if (!response.ok) throw new Error('Usuario no encontrado');
        const data = await response.json();

        inputName.value = data.displayName || data.handle;
        inputBio.value = data.description || 'Este usuario no tiene biografía pública.';
        actualizarNombre();
        actualizarBio();

        if (data.avatar) {
            avatarSeleccionado = data.avatar;
            avatarPreview.src = data.avatar;
        }
        document.getElementById('country-flag').hidden = true;
        document
            .querySelectorAll('.avatar-option')
            .forEach((el) => el.classList.remove('selected'));

        bskyStatus.textContent = '¡Datos cargados correctamente!';
        bskyStatus.className = 'status-msg status-success';
        } catch (error) {
        bskyStatus.textContent = error.message;
        bskyStatus.className = 'status-msg status-error';
        } finally {
        btnBsky.disabled = false;
        setTimeout(() => { bskyStatus.textContent = ''; }, 3000);
        }
    };

    // == Listeners ==
    inputName.addEventListener('input', actualizarNombre);
    inputBio.addEventListener('input', actualizarBio);
    inputColor.addEventListener('input', actualizarColor);
    if (inputBadge) inputBadge.addEventListener('change', actualizarBadge);
    form.addEventListener('submit', guardarPerfil);

    btnFetch.addEventListener('click', () => {
        const username = inputSearch.value.trim();
        fetchGitHubData(username);
    });

    const btnRandom = document.getElementById('btn-random');
    btnRandom.addEventListener('click', fetchPerfilAleatorio);

    inputSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            btnFetch.click();
        }
    });

    const btnBsky = document.getElementById('btn-bsky');
    const inputBsky = document.getElementById('bsky-search');
    btnBsky.addEventListener('click', () => fetchBlueskyData(inputBsky.value.trim()));
    inputBsky.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            btnBsky.click();
        }
    });

    // == Router de vistas (#/crear y #/galeria) ==
    function mostrarVista(hash) {
        const esGaleria = hash === '#/galeria';

        viewCreate.classList.toggle('active', !esGaleria);
        if (viewGaleria) viewGaleria.classList.toggle('active', esGaleria);

        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === hash);
        });

        if (esGaleria) renderGaleria();
    }

    window.addEventListener('hashchange', () => {
        mostrarVista(window.location.hash || '#/crear');
    });

    // == Galería ==
    function obtenerPerfiles() {
        return JSON.parse(localStorage.getItem('gap_perfiles') || '[]');
    }

    function eliminarPerfil(id) {
        if (!confirm('¿Eliminar esta tarjeta?')) return;
        const perfiles = obtenerPerfiles().filter((p) => p.id !== id);
        localStorage.setItem('gap_perfiles', JSON.stringify(perfiles));
        renderGaleria();
    }

    function crearTarjetaGaleria(perfil) {
        const card = document.createElement('article');
        card.className = 'gallery-card';

        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.type = 'button';
        btnDelete.textContent = '✕';
        btnDelete.setAttribute('aria-label', 'Eliminar perfil');
        btnDelete.addEventListener('click', () => eliminarPerfil(perfil.id));

        const header = document.createElement('div');
        header.className = 'card-header';
        header.style.background = `linear-gradient(120deg, ${perfil.color}, #0b2447)`;

        if (perfil.badge) {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = perfil.badge;
            badge.dataset.tipo = perfil.badge;
            card.appendChild(badge);
        }

        const img = document.createElement('img');
        img.className = 'avatar';
        img.src = perfil.avatar;
        img.alt = perfil.nombre;

        const body = document.createElement('div');
        body.className = 'card-body';

        const nombre = document.createElement('h3');
        nombre.textContent = perfil.nombre;

        const bio = document.createElement('p');
        bio.textContent = perfil.bio;

        body.appendChild(nombre);
        body.appendChild(bio);

        card.appendChild(btnDelete);
        card.appendChild(header);
        card.appendChild(img);
        card.appendChild(body);

        return card;
    }

    function renderGaleria() {
        if (!galleryGrid) return;

        const filtro = (gallerySearch?.value || '').trim().toLowerCase();
        const perfiles = obtenerPerfiles()
            .slice()
            .reverse()
            .filter((p) => p.nombre.toLowerCase().includes(filtro));

        galleryGrid.innerHTML = '';

        if (perfiles.length === 0) {
            if (galleryEmpty) galleryEmpty.hidden = false;
            return;
        }

        if (galleryEmpty) galleryEmpty.hidden = true;
        perfiles.forEach((perfil) => {
            galleryGrid.appendChild(crearTarjetaGaleria(perfil));
        });
    }

    if (gallerySearch) {
        gallerySearch.addEventListener('input', renderGaleria);
    }

    // == Inicialización ==
    inicializarTema();
    renderAvatarSelector();
    actualizarColor();
    actualizarBadge();
    mostrarVista(window.location.hash || '#/crear');
});
