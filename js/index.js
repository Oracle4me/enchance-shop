// Navbar interkatif nav link
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section');

    // Fungsi klik navbar active 
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const currentLocation = location.href;
    navLinks.forEach(link => {
        if (link.href === currentLocation) {
            link.classList.add('active');
        }
    });

    // Fungsi scroll navbar active
    const setActiveLinkOnScroll = () => {
        let currentPosition = window.scrollY;
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 50;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;

            if (currentPosition >= sectionTop && currentPosition < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeSection = section.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeSection}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };


    window.addEventListener('scroll', setActiveLinkOnScroll);
    setActiveLinkOnScroll();
});



// Fungsi Filter pada produk kami
const filterButtons = document.querySelectorAll('.filter-btn button');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filterValue = button.dataset.name;
        filterProduk(filterValue);
        setActiveButton(button);
    });
});

const setActiveButton = (activeButton) => {
    filterButtons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Fungsi filter baju 
const filterProduk = (filterValue) => {
    if (filterValue === "all") {
        tambahDataUntukHTML();
    } else {
        const filteredProduk = listProduk.filter(produk => produk.type.toLowerCase() === filterValue.toLowerCase());
        tambahDataFilteredUntukHTML(filteredProduk);
    }
}

// Fungsi update filter ke dalam HTML
const tambahDataFilteredUntukHTML = (filteredProduk) => {
    listProdukHTML.innerHTML = '';
    if (filteredProduk.length > 0) {
        filteredProduk.forEach(produk => {
            let produkBaru = document.createElement('div');
            produkBaru.classList.add('produk-item-wrap');
            produkBaru.dataset.id = produk.id;
            produkBaru.dataset.category = produk.type;
            produkBaru.innerHTML = `
                <div class="produk-item">
                    <img src=${produk.imgSrc} class="top-sell-img">
                </div>
                <p>${produk.nama_produk}</p>
                <div class="price">
                    <span>Rp.${produk.harga}</span>
                    <span>Rp.${produk.diskon}</span>
                </div>
                <div class="btn-wrapper">
                    <button type="button" class="buy" data-id="${produk.id}">Beli</button>
                    <button type="button" class="addCart" data-bs-toggle="modal" data-bs-target="#keranjang">Tambahkan Keranjang</button>
                </div>
            `;
            listProdukHTML.appendChild(produkBaru);
        });
        attachBuyButtonListeners();
    }
}

const attachBuyButtonListeners = () => {
    document.querySelectorAll('.buy').forEach(button => {
        button.addEventListener('click', (event) => {
            const produkId = event.target.dataset.id;
            beliProduk(produkId);
        });
    });
}
