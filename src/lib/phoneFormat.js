// Дозволяємо вільний ввід, форматуємо тільки при blur

export function formatPhone(value) {
  // Просто фільтруємо — тільки цифри, +, (, ), -, пробіл
  return value.replace(/[^\d\+\(\)\-\s]/g, '');
}

export function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return 'Введіть номер телефону';
  // Мінімум 10 цифр (з кодом країни) або 9 без
  const local = digits.startsWith('38') ? digits.slice(2) : digits;
  if (local.length < 9) return 'Введіть повний номер';
  return null;
}
