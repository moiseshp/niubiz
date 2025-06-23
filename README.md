# 🧾 `useNiubiz` – React Hook for Niubiz Decoupled SDK Integration

This hook simplifies the integration of the **Niubiz Payment SDK** (in [decoupled mode](https://desarrolladores.niubiz.com.pe/docs/desacoplado)) into modern React applications.

It handles all core aspects of the SDK setup, such as script injection, form mounting, token creation, and form reset, so developers can focus on building a seamless payment experience.

---

## 🎯 Purpose

Niubiz's decoupled SDK allows payment form fields (card number, expiry date, and CVV) to be embedded securely via iframes, keeping sensitive data off your frontend and compliant with PCI standards.

This hook was built to solve the following common needs:

- ✅ Dynamically initialize and unmount the Niubiz SDK
- ✅ Mount secure card fields to specific DOM elements
- ✅ Track validity and errors for each card field
- ✅ Easily retrieve a token (`getTransactionToken`) to send to your backend
- ✅ Reset the payment form after completion (`resetFields`)
- ✅ Know when the form is ready (`isReady`) and fully valid (`isValid`)

---

## 💡 When to Use

Use this hook if:

- You're building a React app that accepts credit/debit card payments through **Niubiz**.
- You want to follow best practices for PCI compliance using the decoupled SDK.
- You prefer a clean, declarative abstraction over manually invoking `window.payform` logic.
- You need a reusable payment form logic in multiple parts of your app (e.g., checkout, subscription, top-up).

---

## ✅ Features Overview

| Feature               | Description                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| `isReady`             | True when the SDK has loaded and all fields are mounted                    |
| `fields`              | Contains the state of each field (`error`, `isValid`, etc.)                |
| `isValid`             | Indicates if **all** fields are valid and the form is ready to submit      |
| `getTransactionToken` | Triggers the Niubiz tokenization process and returns the transaction token |
| `resetFields`         | Clears all Niubiz field inputs and validation states                       |
| `error`               | Captures any SDK initialization failure                                    |

---

## 📦 Example Integration

This library is designed to be used with minimal setup. You only need to provide your configuration and mount 3 `<div>`s for the secure fields.

> You can view a full implementation example in the `src/app/page.tsx` file of this repo.

---

## 📊 Example Cards (cvv: 123)

- 371064649323968 - 03/2028 - 111
- 5160030000000317 - 03/2028 - 111
- 4551708161768059 - 03/2028 - 111
- 4919148107859067
- 4500340090000016
- 4551708161768059
- 4280820087569434
- 4634020606098014
- 4110905000721943

---

## 🔐 Why decoupled mode?

The **decoupled mode** is preferred because:

- Fields are securely rendered inside iframes (PCI DSS compliance)
- You have full control over form layout and styling
- Better UX across platforms, including responsive design and resets
- You don’t store or handle sensitive card data directly

---

## 🧰 Requirements

- React 17+ or 18+
- A valid configuration object from Niubiz
- DOM elements with the expected `id`s for mounting each field (e.g., `card-number`, `card-expiry`, `card-cvc`)
- Internet access to load the Niubiz SDK

---

## 🛟 Support

If you encounter any issues integrating with Niubiz, we recommend:

- Reviewing the [Niubiz official docs](https://desarrolladores.niubiz.com.pe/docs/desacoplado)
- Checking the developer console for `payform` errors
- Ensuring SDK script is loaded before initializing the hook

---

## 📄 License

MIT
