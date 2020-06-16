// eslint-disable-next-line no-undef
const stripe = Stripe(
    'pk_test_51GuY65HKsexgOkeoBc6G4hFn9n1nvEuv2XOL9VxnasTySVESlXDAQdmSuN6OzytzjtRFQCBSAe9CKtWCQiXJH3fi00tG3J80he',
);
const orderBtn = document.getElementById('order-btn');
const onOrderBtnClick = () => {
    stripe.redirectToCheckout({ sessionId: orderBtn.dataset.sessionId });
};

orderBtn.addEventListener('click', onOrderBtnClick);
