export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Сегодня, ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return 'Вчера, ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  } else {
    return `${diffInDays} дня назад, ` + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
};