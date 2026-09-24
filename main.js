let crudId = "e841a8328c4d491185b57486e5001f17";

let API = `https://crudcrud.com/api/${crudId}/ShopItemTracker`;

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM loaded");
    console.log("API:", API);

    axios
        .get(API)
        .then((res) => {
 console.log(res.data);
            res.data.forEach((item) => {
                const row = displayItems(item);
                document.querySelector("#inventoryBody").appendChild(row);
            });

        })
        .catch((err) => console.log(err));

});

function handleFormSubmit(event) {

    event.preventDefault();

    const itemDetails = {
        CandyName: event.target.candy.value,
        Description: event.target.description.value,
        Price: event.target.price.value,
        Quantity: event.target.quantity.value
    };

    axios
        .post(API, itemDetails)
        .then((res) => {

            const row = displayItems(res.data);

            document
                .querySelector("#inventoryBody")
                .appendChild(row);

        })
        .catch((err) => console.log(err));


    event.target.candy.value = "";
    event.target.description.value = "";
    event.target.price.value = "";
    event.target.quantity.value = "";
}


function displayItems(item) {

    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = item.CandyName;

    const tdDesc = document.createElement("td");
    tdDesc.textContent = item.Description;

    const tdPrice = document.createElement("td");
    tdPrice.textContent = `$${item.Price}`;

    const tdQty = document.createElement("td");
    tdQty.textContent = item.Quantity;

    const td = document.createElement("td");

    const div = document.createElement("div");
    div.className = "d-flex gap-2";

    const select = document.createElement("select");
    select.className = "form-select form-select-sm w-auto";

    const option1 = document.createElement("option");
    option1.value = "1";
    option1.textContent = "1";

    const option2 = document.createElement("option");
    option2.value = "2";
    option2.textContent = "2";

    const option3 = document.createElement("option");
    option3.value = "3";
    option3.textContent = "3";


    select.appendChild(option1);
    select.appendChild(option2);
    select.appendChild(option3);

    const button = document.createElement("button");

    button.type = "button";
    button.className = "btn btn-sm btn-success";
    button.textContent = "Buy";


    div.appendChild(select);
    div.appendChild(button);

    td.appendChild(div);


    tr.appendChild(tdName);
    tr.appendChild(tdDesc);
    tr.appendChild(tdPrice);
    tr.appendChild(tdQty);
    tr.appendChild(td);


    button.addEventListener("click", function () {

        const selectedQuantity = Number(select.value);
        axios
            .get(`${API}/${item._id}`)

            .then((res) => {

                const currentItem = res.data;
                const currentQuantity = Number(currentItem.Quantity);

                if (currentQuantity <= 0) {
                    alert("This item is out of stock.");
                    return null;
                }

                if (selectedQuantity > currentQuantity) {
                    alert("Not enough stock!");
                    return null;
                }

                const newQuantity = currentQuantity - selectedQuantity;
                return axios.put(
                    `${API}/${item._id}`,
                    {
                        CandyName: currentItem.CandyName,
                        Description: currentItem.Description,
                        Price: currentItem.Price,
                        Quantity: newQuantity
                    }
                ).then(() => newQuantity);

            })
            .then((newQuantity) => {
                if (newQuantity === null) return;
                tdQty.textContent = newQuantity;
            })
            .catch((err) => { console.log(err); });

    });

    return tr;

}