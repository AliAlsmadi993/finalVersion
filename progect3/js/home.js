function toggleMenu() {
  const menu = document.getElementById('custom-menu');
  menu.classList.toggle('show-links');
  }
  
  const Apply = document.getElementById("apply");
  const result = document.getElementById("result");
  const login_btn = document.querySelector(".btn-login");
  const userlogin = JSON.parse(localStorage.getItem("loggedInUser"));
  
  // تحقق من حالة المستخدم
  if (userlogin) {
      if (result) result.style.display = "inline";
      if (Apply) Apply.style.display = "inline";
      login_btn.innerHTML = "Log Out";
  
      // تسجيل الخروج
      login_btn.addEventListener("click", function () {
          localStorage.removeItem("loggedInUser");
          window.location.reload();
      });
  } else {
      if (Apply) Apply.style.display = "none";
      if (result) result.style.display = "none";
      login_btn.innerHTML = "Log In";
  
      // توجيه لتسجيل الدخول
      login_btn.addEventListener("click", function () {
          window.location.href = "logIn.html";
      });
  }