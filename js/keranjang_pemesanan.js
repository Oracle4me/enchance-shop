// Deklarasi tombol untuk membuka tutup keranjang seperti Modal 
let iconCart = document.querySelector('.icon-cart');
let openCart = document.getElementById('cartSidebar');
let closeCart = document.querySelector('.close')

// Produk
let listProdukHTML = document.getElementById('listProduk');
let listKeranjangHTML = document.querySelector('.list-cart')
let iconKeranjangSpan = document.querySelector('.icon-cart span')
let listProduk = [];
let keranjang = [];

// Buka Keranjang
iconCart.addEventListener('click', () => {
  openCart.classList.toggle('showCart')
})

// Tutup Keranjang
closeCart.addEventListener('click', () => {
  openCart.classList.toggle('showCart');
})

// Fungsi Tambah data untuk menampilkan produk ke dalam HTML
const tambahDataUntukHTML = () => {
  listProdukHTML.innerHTML = '';
  if (listProduk.length > 0) {
    listProduk.forEach(produk => {
      let produkBaru = document.createElement('div');
      produkBaru.classList.add('produk-item-wrap');
      produkBaru.dataset.id = produk.id;
      produkBaru.dataset.category = produk.category;
      produkBaru.innerHTML = `
          <div class="produk-item">
            <img src=${produk.imgSrc} class="top-sell-img">
          </div>
          <p>${produk.nama_produk}</p>
          <div class="price">
          <span>
          Rp.${produk.harga}
          </span>  
          <span>
          Rp.${produk.diskon}
          </span>  
          </div>
          <div class="btn-wrapper">
            <button type="button" class="buy" data-id="${produk.id}">
              Beli
            </button>
            <button type="button" class="addCart" data-bs-toggle="modal" data-bs-target="#keranjang">
              Tambahkan Keranjang
            </button>
          </div>
   `
      listProdukHTML.appendChild(produkBaru);
    })
    document.querySelectorAll('.buy').forEach(button => {
      button.addEventListener('click', (event) => {
        const produkId = event.target.dataset.id;
        beliProduk(produkId);
      });
    });
  }
}

// Fungsi untuk tombol beli
const beliProduk = (produkId) => {
  const selectedProduct = listProduk.find(produk => produk.id == produkId);
  if (selectedProduct) {
    window.location.href = `/pesanan.html?id=${selectedProduct.id}`;
  }
}

// Tombol tambah keranjang untuk menambahkan produk ke dalam keranjang
listProdukHTML.addEventListener('click', (event) => {
  let posisiClick = event.target;
  if (posisiClick.classList.contains('addCart')) {
    let produkItemWrap = posisiClick.closest('.produk-item-wrap');
    if (produkItemWrap) {
      let id_produk = produkItemWrap.dataset.id;
      tambahKeranjang(id_produk);
    }
  }
});

// Fungsi tambah produk ke dalam keranjang
const tambahKeranjang = (id_produk) => {
  let posisiClickProdukKeranjang = keranjang.findIndex((value) => value.id_produk == id_produk)

  let posisiProduk = listProduk.findIndex((value) => value.id == id_produk)
  let produkInfo = listProduk[posisiProduk];

  if (keranjang.length <= 0) {
    keranjang = [{
      id_produk: id_produk,
      jumlah: 1
    }]
  } else if (posisiClickProdukKeranjang < 0) {
    keranjang.push({
      id_produk: id_produk,
      jumlah: 1
    });
  } else {
    keranjang[posisiClickProdukKeranjang].jumlah = keranjang[posisiClickProdukKeranjang].jumlah += 1
  }

  // Masukan data JSON kedalam cookie
  let produkCookies = keranjang.map((item) => {
    let produkDetail = listProduk.find((produk) => produk.id == item.id_produk);
    return {
      id_produk: item.id_produk,
      nama_produk: produkDetail.nama_produk,
      imgSrc: produkDetail.imgSrc,
      harga: produkDetail.harga,
      jumlah: item.jumlah
    };
  });

  document.cookie = `listKeranjang=${JSON.stringify(produkCookies)}; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;`;

  tambahKeranjangUntukHTML()
  // simpanKeranjang();
}

// Fungsi keranjang untuk menyimpang di memory
const simpanKeranjang = () => {
  localStorage.setItem('keranjang', JSON.stringify(keranjang));
}

// Fungsi Tambah produk di keranjang 
const tambahKeranjangUntukHTML = () => {
  listKeranjangHTML.innerHTML = '';
  let totalJumlahProduk = 0;
  if (keranjang.length > 0) {
    keranjang.forEach(keranjang => {
      totalJumlahProduk = totalJumlahProduk + keranjang.jumlah;
      let keranjangBaru = document.createElement('div');
      keranjangBaru.classList.add('item');
      keranjangBaru.dataset.id = keranjang.id_produk;
      let posisiProduk = listProduk.findIndex((value) => value.id == keranjang.id_produk);
      let info = listProduk[posisiProduk];
      keranjangBaru.innerHTML = `
          <div class="image">
            <img src="${info.imgSrc}" alt="item_produk">
          </div>
          <div class="nama">
            ${info.nama_produk}
          </div>
          <div class="totalHarga">
            ${info.harga}
          </div>
          <div class="jumlah">
            <span class="minus">&LeftArrow;</span>
            <span >${keranjang.jumlah}</span>
            <span class="plus">&RightArrow;</span>
          </div>
   `;
      listKeranjangHTML.appendChild(keranjangBaru);
    })
  }
  iconKeranjangSpan.innerText = totalJumlahProduk;
}

// Tombol untuk menambahkan jumlah produk atau mengurangi produk
listKeranjangHTML.addEventListener('click', (event) => {
  let posisiClick = event.target;
  if (posisiClick.classList.contains('minus') || posisiClick.classList.contains('plus')) {
    let id_produk = posisiClick.parentElement.parentElement.dataset.id;
    let type = 'minus';
    if (posisiClick.classList.contains('plus')) {
      type = 'plus'
    }
    ubahJumlah(id_produk, type)
  }
})

// Perhitungan Kurang dan Tambah jumlah produk
const ubahJumlah = (id_produk, type) => {
  let posisiProdukDiKeranjang = keranjang.findIndex((value) => value.id_produk = id_produk)
  if (posisiProdukDiKeranjang >= 0) {
    switch (type) {
      case 'plus':
        keranjang[posisiProdukDiKeranjang].jumlah = keranjang[posisiProdukDiKeranjang].jumlah + 1;
        break;
      default:
        let jumlahBerubah = keranjang[posisiProdukDiKeranjang].jumlah - 1
        if (jumlahBerubah > 0) {
          keranjang[posisiProdukDiKeranjang].jumlah = jumlahBerubah
        } else {
          keranjang.splice(posisiProdukDiKeranjang, 1)
        }
        break;
    }
  }
  simpanKeranjang();
  tambahKeranjangUntukHTML();
}


// Ambil data dari JSON
const fetchData = () => {
  // Ambil data
  fetch('/data/produk.json')
    .then(response => response.json())
    .then(data => {
      listProduk = data
      tambahDataUntukHTML();

      // Semua yang ditambahkan keranjang akan disimpan di localStorage
      if (localStorage.getItem('keranjang')) {
        keranjang = JSON.parse(localStorage.getItem('keranjang'));
        tambahKeranjangUntukHTML();
      }
    })
}

fetchData();


