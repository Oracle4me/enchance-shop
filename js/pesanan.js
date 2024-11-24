let listCart = [];
function checkCart() {
    var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listKeranjang='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }
}
checkCart();
addCartToHTML();
function addCartToHTML() {
    // clear data default
    let listCartHTML = document.querySelector('.returnCart .list');
    listCartHTML.innerHTML = '';

    let totalQuantityHTML = document.querySelector('.totalQuantity');
    let totalPriceHTML = document.querySelector('.totalPrice');
    let totalQuantity = 0;
    let totalPrice = 0;

    // Format options for IDR
    const formatRupiah = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    // if has produk in Cart
    if (listCart) {
        listCart.forEach(produk => {
            if (produk) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML =
                    `<img src="${produk.imgSrc}">
                    <div class="info">
                        <div class="name">${produk.nama_produk}</div>
                        <div class="harga">${formatRupiah.format(produk.harga)}/1 produk</div>
                    </div>
                    <div class="jumlah">${produk.jumlah}</div>
                    <div class="returnPrice">${formatRupiah.format(produk.harga * produk.jumlah)}</div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity += produk.jumlah;
                totalPrice += (produk.harga * produk.jumlah);
            }
        })
    }
    totalQuantityHTML.innerText = totalQuantity;
    totalPriceHTML.innerText = formatRupiah.format(totalPrice);
}

// Fungsi pesan terima dummy
document.getElementById('pesanSekarangBtn').addEventListener('click', function () {
    alert('Pesanan Anda telah diterima!');
    document.cookie = "listKeranjang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "pesanan.html";
});