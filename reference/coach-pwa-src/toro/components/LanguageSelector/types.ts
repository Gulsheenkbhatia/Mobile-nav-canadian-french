export interface Language {
  name: string
  href: string
}

export interface DataQA {
  flag?: string
  label?: string
  lang?: string
}

export interface CountryItem {
  label: string
  flag: string
  languages: Language[]
  dataQA: DataQA
}

export interface ViewMore {
  viewMoreText: string
  viewMoreLink?: string
}

export interface Dropdown {
  title: string
  items: CountryItem[]
  viewMore: ViewMore
  selectedItemIndex: number
  selectedLanguageIndex: number
}

export interface Selector {
  label: string
  flag: string
  dataQA: DataQA
}

export interface CountrySelectorData {
  selector: Selector
  dropdown: Dropdown
}

export interface NavLinkData {
  variant: string
  text: string
  icon: JSX.Element
  qaLink?: string
  dataQA: {
    label: string
  }
}

// Component Props

export interface ModalBasedCountrySelectorProps {
  content: CountrySelectorData
  showPopupToNewVistorOnLanding: boolean
}

export interface CountrySelectorModalProps {
  id: string
  content: CountrySelectorData
  showModal: boolean
  closeModal: () => void
  showPopupOnLanding: boolean
}

export interface CountrySelectorDropdownProps {
  countryList: CountryItem[]
  selectedCountry: CountryItem | null
  setSelectedCountry: React.Dispatch<React.SetStateAction<CountryItem>>
}
export interface CountrySelectorDropdownListProps {
  list: CountryItem[]
  selectedFlag: string
  onSelection: (country: CountryItem) => void
}
