document.addEventListener("DOMContentLoaded", function () {

    // ================= LOGIN / LOGOUT BUTTON =================
    const loginBtn = document.getElementById("loginBtn");
    const userName = localStorage.getItem("userName");

    if (loginBtn && userName) {
        loginBtn.innerHTML = "Welcome " + userName + " | Logout";
        loginBtn.href = "#";

        loginBtn.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.clear();
            alert("Logged Out");
            window.location.href = "index.html";
        });
    }

    // ================= APPOINTMENT FORM =================
    const appointmentForm = document.getElementById("appointmentForm");

    if (appointmentForm) {

        appointmentForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = {
                fullName: document.querySelector('[name="fullName"]').value,
                email: document.querySelector('[name="email"]').value,
                phone: document.querySelector('[name="phone"]').value,
                doctor: document.querySelector('[name="doctor"]').value,
                date: document.querySelector('[name="date"]').value,
                time: document.querySelector('[name="time"]').value,
                message: document.querySelector('[name="message"]').value,
                status: "Pending"
            };

            try {

                const response = await fetch("http://localhost:7000/Addappointments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                alert(data.message);

                appointmentForm.reset();

            } catch (error) {
                console.error(error);
                alert("Failed to book appointment");
            }

        });
    }

});