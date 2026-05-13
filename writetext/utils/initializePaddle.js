// paddleSetup.js
export const initializePaddle = (paddlePaymentSettings, eventCallback) => {
    if (!window.Paddle) {
      console.error('Paddle.js is not loaded');
      return;
    }
    if (paddlePaymentSettings.isSandbox) {
      Paddle.Environment.set('sandbox');
    }
   // Paddle.Environment.set('sandbox');  // Set environment
   // Initialize Paddle if not initialized
   
   if (!Paddle.Initialized) {
    Paddle.Initialize({
      token: paddlePaymentSettings.clientId,
      eventCallback: eventCallback,
      checkout:{
        settings:{
          showAddTaxId: false,
          allowLogout: false,
          showAddDiscounts: false
        }
      }
    });
  } else {
    // Update if already initialized
    Paddle.Update({
      token: paddlePaymentSettings.clientId,
      eventCallback: eventCallback,
      checkout:{
        settings:{
          showAddTaxId: false,
          allowLogout: false,
          showAddDiscounts: false
        }
      }
    });
  }
  };
  