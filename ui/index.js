const checkLoginStatus1 = async () => {
  if ("token" in localStorage) {
    window.location.replace("http://localhost:3000/ui/books");
  }
};

const checkLoginStatus2 = async () => {
  if (localStorage.getItem("token") === null) {
    window.location.replace("http://localhost:3000/ui/login");
  }
};

const fetchBooksList = async () => {
  try {
    const url = "http://localhost:3000/books";
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        AuthorizationToken: "Bearer " + localStorage.getItem("token"),
      },
    });
    const resData = await response.json();
    const booksData = resData.booksData;
    booksData.forEach((book) => {
      const tableElement = document.getElementById("tableWrapper");
      const row = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");
      const td4 = document.createElement("td");
      const td5 = document.createElement("td");
      td1.innerHTML = book.title;
      td2.innerHTML = book.genre;
      td3.innerHTML = book.author;
      td4.innerHTML = book.price;
      td5.innerHTML = book.stock;
      row.appendChild(td1);
      row.appendChild(td2);
      row.appendChild(td3);
      row.appendChild(td4);
      row.appendChild(td5);
      tableElement.appendChild(row);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const loginHandler = async () => {
  try {
    const userName = document.getElementById("userName").value;
    const password = document.getElementById("password").value;

    const data = {
      userName: userName,
      password: password,
    };
    const url = "http://localhost:3000/auth/login";
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    const token = resData.user.tokens[0].token;
    await localStorage.setItem("token", token);
    checkLoginStatus1();
  } catch (error) {
    document.getElementById("errorMessage").innerHTML =
      error.message + ". Re-check Credentials entered.";
    console.log(error.message);
  }
};

const logoutHandler = async () => {
  localStorage.clear();
  window.location.href = "http://localhost:3000/ui/login";
};

// const response = await fetch(url, {
//     method: "POST", // *GET, POST, PUT, DELETE, etc.
//     mode: "cors", // no-cors, *cors, same-origin
//     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: "same-origin", // include, *same-origin, omit
//     headers: {
//       "Content-Type": "application/json",
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     redirect: "follow", // manual, *follow, error
//     referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     body: JSON.stringify(data), // body data type must match "Content-Type" header
//   });
