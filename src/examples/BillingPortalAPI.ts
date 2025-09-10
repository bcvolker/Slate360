// Examples of how to use the Billing Portal API endpoints directly

// Example 1: Check billing portal access
export const checkBillingAccess = async () => {
  try {
    const response = await fetch('/api/billing/portal');
    
    if (response.ok) {
      const accessData = await response.json();
      console.log('Billing access:', accessData);
      return accessData;
    } else {
      const error = await response.json();
      console.error('Failed to check billing access:', error);
      throw new Error(error.error);
    }
  } catch (error) {
    console.error('Error checking billing access:', error);
    throw error;
  }
};

// Example 2: Create billing portal session
export const createBillingPortalSession = async (returnUrl?: string) => {
  try {
    const response = await fetch('/api/billing/portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ returnUrl }),
    });

    if (response.ok) {
      const sessionData = await response.json();
      console.log('Portal session created:', sessionData);
      return sessionData;
    } else {
      const error = await response.json();
      console.error('Failed to create portal session:', error);
      throw new Error(error.error);
    }
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Example 3: Redirect to billing portal
export const redirectToBillingPortal = async (returnUrl?: string) => {
  try {
    const sessionData = await createBillingPortalSession(returnUrl);
    
    // Option 1: Redirect in current tab
    window.location.href = sessionData.url;
    
    // Option 2: Open in new tab
    // window.open(sessionData.url, '_blank');
    
    return sessionData;
  } catch (error) {
    console.error('Error redirecting to billing portal:', error);
    throw error;
  }
};

// Example 4: Billing portal with custom return URL
export const billingPortalWithCustomReturn = async () => {
  const customReturnUrl = `${window.location.origin}/dashboard/billing?returned=true&timestamp=${Date.now()}`;
  
  try {
    const sessionData = await createBillingPortalSession(customReturnUrl);
    console.log('Portal session with custom return URL:', sessionData);
    
    // Redirect to portal
    window.location.href = sessionData.url;
    
    return sessionData;
  } catch (error) {
    console.error('Error with custom return URL:', error);
    throw error;
  }
};

// Example 5: Check access and create session if available
export const conditionalBillingPortalAccess = async () => {
  try {
    // First check if user can access billing portal
    const accessData = await checkBillingAccess();
    
    if (accessData.canAccess) {
      console.log('User can access billing portal, creating session...');
      
      // Create portal session
      const sessionData = await createBillingPortalSession();
      
      // Redirect to portal
      window.location.href = sessionData.url;
      
      return { access: accessData, session: sessionData };
    } else {
      console.log('User cannot access billing portal:', accessData);
      
      // Handle no access - maybe redirect to upgrade page
      if (!accessData.hasStripeCustomer) {
        window.location.href = '/pricing';
      } else {
        console.log('User has Stripe customer but no portal access');
      }
      
      return { access: accessData, session: null };
    }
  } catch (error) {
    console.error('Error in conditional billing access:', error);
    throw error;
  }
};

// Example 6: Error handling with user feedback
export const robustBillingPortalAccess = async (returnUrl?: string) => {
  try {
    // Check access first
    const accessData = await checkBillingAccess();
    
    if (!accessData.canAccess) {
      throw new Error('Billing portal access not available for your account type');
    }
    
    // Create portal session
    const sessionData = await createBillingPortalSession(returnUrl);
    
    // Success - redirect to portal
    window.location.href = sessionData.url;
    
    return sessionData;
    
  } catch (error) {
    console.error('Billing portal access failed:', error);
    
    // Provide user-friendly error messages
    let userMessage = 'Unable to access billing portal';
    
    if ((error as any).message.includes('Unauthorized')) {
      userMessage = 'Please log in to access billing portal';
    } else if ((error as any).message.includes('No billing account')) {
      userMessage = 'No billing account found. Please contact support.';
    } else if ((error as any).message.includes('access not available')) {
      userMessage = 'Billing portal access not available for your account type. Please upgrade to Premium or Enterprise.';
    } else if ((error as any).message.includes('Stripe service')) {
      userMessage = 'Billing service temporarily unavailable. Please try again later.';
    }
    
    // You could show this message in your UI
    console.log('User message:', userMessage);
    
    // Re-throw for further handling
    throw new Error(userMessage);
  }
};

// Example 7: Batch billing operations
export const batchBillingOperations = async () => {
  try {
    const results: any = {
      accessCheck: null,
      sessionCreation: null,
      errors: [] as any[],
    };
    
    // Check access
    try {
      results.accessCheck = await checkBillingAccess();
    } catch (error: any) {
      results.errors.push({ operation: 'access_check', error: error.message });
    }
    
    // If access is available, create session
    if (results.accessCheck?.canAccess) {
      try {
        results.sessionCreation = await createBillingPortalSession();
      } catch (error: any) {
        results.errors.push({ operation: 'session_creation', error: error.message });
      }
    }
    
    console.log('Batch billing operations results:', results);
    return results;
    
  } catch (error) {
    console.error('Error in batch billing operations:', error);
    throw error;
  }
};

// Example 8: Billing portal with retry logic
export const billingPortalWithRetry = async (maxRetries = 3, returnUrl?: string) => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Billing portal attempt ${attempt}/${maxRetries}`);
      
      const sessionData = await createBillingPortalSession(returnUrl);
      console.log('Portal session created successfully on attempt', attempt);
      
      // Redirect to portal
      window.location.href = sessionData.url;
      
      return sessionData;
      
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  // All retries failed
  throw new Error(`Billing portal access failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
};
