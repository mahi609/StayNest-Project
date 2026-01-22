document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.querySelector("#payBtn");

  if (!payBtn) {
    console.error("Pay button not found");
    return;
  }

  payBtn.addEventListener("click", async () => {
    const listingId = payBtn.dataset.listingId;

    if (!listingId) {
      console.error(" Listing ID missing");
      return;
    }

    // CREATE ORDER
    const res = await fetch(`/listings/${listingId}/create`, {
      method: "POST",
    });

    const order = await res.json();

    const options = {
      key: window.RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "Listing Payment",
      description: "Secure Payment",
      order_id: order.id,

      handler: async function (response) {
        const verify = await fetch(
          `/listings/${listingId}/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          }
        );

        const result = await verify.json();

        if (result.success) {
          alert("Payment Successful ✅");
          location.reload();
        } else {
          alert("Payment Failed ");
        }
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  });
});
