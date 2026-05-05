import { createClient } from 'contentful';

const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
});

// Всі послуги (для ServicesPage, HomePage, BookingPage)
export const getServices = async () => {
  const res = await client.getEntries({ content_type: 'service', order: 'fields.num', limit: 50 });
  return res.items.map(item => item.fields);
};

// Одна послуга по serviceId (для ServiceDetailPage)
export const getServiceById = async (serviceId) => {
  const res = await client.getEntries({
    content_type: 'service',
    'fields.serviceId': serviceId,
    limit: 1,
  });
  return res.items[0]?.fields || null;
};

// Прайс-ліст згрупований по категоріях (для PricingPage)
export const getPricingItems = async () => {
  const res = await client.getEntries({ content_type: 'pricingItem', order: 'fields.order', limit: 200 });
  return res.items.reduce((acc, item) => {
    const { category, ...rest } = item.fields;
    if (!acc[category]) acc[category] = [];
    acc[category].push(rest);
    return acc;
  }, {});
};

// Галерея з Instagram через Behold (останні 12) + Contentful фото
export const getGalleryItems = async () => {
  const [beholdRes, contentfulRes] = await Promise.allSettled([
    fetch('https://feeds.behold.so/MGaSRLEeRqLdDDrSvWwY').then(r => r.json()),
    client.getEntries({ content_type: 'galleryItem', order: 'fields.order', limit: 50 }),
  ]);

  const instaPosts = beholdRes.status === 'fulfilled'
    ? beholdRes.value.posts.slice(0, 24).map((post, i) => ({
        id: `insta-${post.id}`,
        title: post.caption ? post.caption.split('\n')[0] : 'Pudra Beauty Room',
        category: 'Instagram',
        desc: post.caption ? post.caption.slice(0, 60) + (post.caption.length > 60 ? '...' : '') : '',
        photo: post.sizes?.large?.mediaUrl || post.sizes?.medium?.mediaUrl || post.mediaUrl,
        video: post.mediaType === 'VIDEO' ? post.mediaUrl : null,
        permalink: post.permalink,
        order: i,
        source: 'instagram',
      }))
    : [];

  const contentfulPosts = contentfulRes.status === 'fulfilled'
    ? contentfulRes.value.items.map((item, i) => ({
        id: `cf-${item.sys.id}`,
        ...item.fields,
        photo: item.fields.photo?.fields?.file?.url
          ? 'https:' + item.fields.photo.fields.file.url
          : null,
        order: item.fields.order ?? 100 + i,
        source: 'contentful',
      }))
    : [];

  return [...contentfulPosts, ...instaPosts];
};

// Статистика (для HomePage та AboutPage)
export const getStats = async () => {
  const res = await client.getEntries({ content_type: 'stat', order: 'fields.order', limit: 10 });
  return res.items.map(item => item.fields);
};

// Відгуки
export const getReviews = async () => {
  const res = await client.getEntries({ content_type: 'review', order: 'fields.order', limit: 50 });
  return res.items.map(item => item.fields);
};
export const getSiteSettings = async () => {
  const res = await client.getEntries({ content_type: 'contacts', limit: 1 });
  return res.items[0]?.fields || null;
};

// Спеціаліст (для AboutPage)
export const getSpecialist = async () => {
  const res = await client.getEntries({ content_type: 'specialist', limit: 1 });
  const item = res.items[0];
  if (!item) return null;
  return {
    ...item.fields,
    photo: item.fields.photo?.fields?.file?.url
      ? 'https:' + item.fields.photo.fields.file.url
      : null,
  };
};
