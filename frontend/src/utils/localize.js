import { ageRangesConfig, store } from '../data/catalog'

export function localizeProduct(product, locale) {
  const isArabic = locale === 'ar'
  const age = ageRangesConfig.find((item) => item.value === product.ageRange)
  return {
    ...product,
    name: isArabic ? product.nameAr : product.nameFr,
    shortName: isArabic ? product.shortNameAr : product.shortNameFr,
    description: isArabic ? product.descriptionAr : product.descriptionFr,
    image: product.primaryImageUrl,
    category: product.category.slug,
    categoryLabel: isArabic ? product.category.nameAr : product.category.nameFr,
    subCategory: isArabic ? product.subCategoryAr : product.subCategoryFr,
    age: product.ageRange,
    ageLabel: age ? (isArabic ? age.labelAr : age.labelFr) : product.ageRange,
    featuresLocalized: product.features?.map((feature) => (isArabic ? feature.textAr : feature.textFr)) || [],
    imagesLocalized: product.images?.map((image) => ({
      ...image,
      alt: isArabic ? image.altAr : image.altFr,
    })) || [],
    attributesLocalized: product.attributes?.map((attribute) => ({
      ...attribute,
      value: isArabic ? attribute.valueAr : attribute.valueFr,
    })) || [],
  }
}

export function localizeCategory(category, locale) {
  const isArabic = locale === 'ar'
  return {
    ...category,
    name: isArabic ? category.nameAr : category.nameFr,
    description: isArabic ? category.descriptionAr : category.descriptionFr,
    image: category.imageUrl,
  }
}

export function localizedAgeRanges(locale) {
  return ageRangesConfig.map((age) => ({
    ...age,
    label: locale === 'ar' ? age.labelAr : age.labelFr,
  }))
}

export function localizedStore(locale) {
  return { ...store, address: locale === 'ar' ? store.addressAr : store.addressFr }
}
