const btn = document.getElementById("mailButton");

btn.addEventListener("click", async () => {
  // Activate the afterAnimation state
  document.documentElement.classList.add("afterAnimation");

  // Reset to default state
  btn.classList.remove("button-success", "button-failure");

  try {
    const response = await fetch("http://localhost:8899/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        "I think there's a problem with this: " + response.statusText
      );
    }

    // Add success class
    btn.classList.add("button-success"); // Green color for success

    // SweetAlert2 success alert
    await Swal.fire({
      icon: "success",
      title: "Haha, Email was sent successfully!",
      confirmButtonText: "OK! Thanks a lot!",
      background: "#1c1c1e", // Optional: customize background
      color: "#e5e5e5", // Optional: customize text color
    });
  } catch (error) {
    console.error("Error:", error);
    // Add failure class
    btn.classList.add("button-failure"); // Red color for failure

    // SweetAlert2 error alert
    await Swal.fire({
      icon: "error",
      title: "Sorry, Email was not sent",
      text: error.message,
      confirmButtonText: "Why?",
      background: "#1c1c1e", // Optional: customize background
      color: "#e5e5e5", // Optional: customize text color
    });
  } finally {
    // Wait for the animation to finish, then reset button state
    setTimeout(() => {
      btn.classList.remove("button-success", "button-failure");
      btn.style.transition = "background-color 0.5s ease"; // Smooth transition for reset
      document.documentElement.classList.remove("afterAnimation");
    }, 2000); // Adjust duration if needed
  }
});
