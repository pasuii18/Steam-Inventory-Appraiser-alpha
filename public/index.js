// Получение всех предметов
async function GetInventoryItems() { 
  const response = await fetch("https://steamcommunity.com/inventory/" + userIdInput + "/730" + "/2", {
      method: "GET",
      headers: { "Accept": "application/json" }
  });
  if (response.ok === true) {
      const posts = await response.json();
      posts.descriptions.forEach(inventoryInfo => {
          MakeItemLot(inventoryInfo);
      });
  }
}

// Получение цен на предметы
async function GetItemPrice(hashName) { 
  const response = await fetch("https://steamcommunity.com/market/priceoverview/?currency=1&country=us&appid=730&market_hash_name=" + hashName + "&format=json", {
      method: "GET",
      headers: { "Accept": "application/json" }
  });
  if (response.ok === true) {
      const price = await response.json();
      return price.lowest_price
  }
}

var fullPrice = 0;
var isSellable = document.querySelector('input[type=checkbox]'); 
// создание лота с предметом
async function MakeItemLot(inventoryInfo) {
  const isSellableChecked = isSellable.checked;
  if (isSellableChecked) 
  {
    if (inventoryInfo.marketable == "1") 
    {
      await MakeLot(inventoryInfo);
    }
  } 
  else 
  {
    await MakeLot(inventoryInfo);
  }
}

// создание лота
async function MakeLot(inventoryInfo) {
  let priceText = "Not sallable";
  const post = document.createElement('div');
  const inventoryBottom = document.getElementById("inventoryBottom");
  const parentDiv = inventoryBottom.parentNode;

  post.id = 'inventoryBottom';
  post.className = 'itemLot';

  if(inventoryInfo.marketable == "1")
  {
    const price = await GetItemPrice(inventoryInfo.market_hash_name);
    if (price) 
    {
      fullPrice += Number(price.slice(1, 5));
      document.getElementById('fullPrice').innerHTML = "$" + rounded(fullPrice);
      priceText = price;
    }
    else
    {
      priceText = "429 error";
    }
  }

  const htmlText = `
    <img src="http://cdn.steamcommunity.com/economy/image/${inventoryInfo.icon_url}">
    <div class="text">
      <p class="itemName" style="color: #${inventoryInfo.name_color};">${inventoryInfo.name}</p>
      <p class="price">${priceText}</p>
    </div>`;

  post.innerHTML = htmlText;

  parentDiv.insertBefore(post, inventoryBottom);
}

// cool округление
var rounded = function(number){
  return +number.toFixed(2);
}

var userIdInput;
getItemsBtn = document.querySelector(".getItemsBtn");
getItemsBtn.addEventListener("click", () => {
  userIdInput = document.getElementById('userIdInput').value;
  GetInventoryItems(userIdInput);
})