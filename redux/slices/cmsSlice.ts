import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Banner {
  id: string
  image: string
  heading: string
  subheading: string
  buttonLabel?: string
  buttonLink?: string
  order: number
}

interface TeamMember {
  id: string
  name: string
  photo: string
  designation: string
  linkedin?: string
  twitter?: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  image?: string
  createdAt: string
}

interface Testimonial {
  id: string
  name: string
  photo?: string
  quote: string
  rating?: number
}

interface CMSState {
  header: {
    logo: string
    navigation: Array<{ name: string; href: string; order: number }>
    ctaButton?: { label: string; href: string }
  }
  footer: {
    address: string
    phone: string
    email: string
    socialLinks: Array<{ platform: string; url: string }>
    quickLinks: Array<{ name: string; href: string }>
  }
  banners: Banner[]
  about: {
    content: string
    image?: string
  }
  gallery: Array<{ id: string; url: string; category: string; alt: string }>
  events: Event[]
  team: TeamMember[]
  testimonials: Testimonial[]
  loading: boolean
}

const initialState: CMSState = {
  header: {
    logo: "",
    navigation: [],
    ctaButton: undefined,
  },
  footer: {
    address: "",
    phone: "",
    email: "",
    socialLinks: [],
    quickLinks: [],
  },
  banners: [],
  about: {
    content: "",
    image: undefined,
  },
  gallery: [],
  events: [],
  team: [],
  testimonials: [],
  loading: false,
}

const cmsSlice = createSlice({
  name: "cms",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    updateHeader: (state, action: PayloadAction<Partial<CMSState["header"]>>) => {
      state.header = { ...state.header, ...action.payload }
    },
    updateFooter: (state, action: PayloadAction<Partial<CMSState["footer"]>>) => {
      state.footer = { ...state.footer, ...action.payload }
    },
    setBanners: (state, action: PayloadAction<Banner[]>) => {
      state.banners = action.payload
    },
    addBanner: (state, action: PayloadAction<Banner>) => {
      state.banners.push(action.payload)
    },
    updateBanner: (state, action: PayloadAction<Banner>) => {
      const index = state.banners.findIndex((b) => b.id === action.payload.id)
      if (index !== -1) {
        state.banners[index] = action.payload
      }
    },
    deleteBanner: (state, action: PayloadAction<string>) => {
      state.banners = state.banners.filter((b) => b.id !== action.payload)
    },
    updateAbout: (state, action: PayloadAction<Partial<CMSState["about"]>>) => {
      state.about = { ...state.about, ...action.payload }
    },
    setGallery: (state, action: PayloadAction<CMSState["gallery"]>) => {
      state.gallery = action.payload
    },
    addGalleryItem: (state, action: PayloadAction<CMSState["gallery"][0]>) => {
      state.gallery.push(action.payload)
    },
    deleteGalleryItem: (state, action: PayloadAction<string>) => {
      state.gallery = state.gallery.filter((item) => item.id !== action.payload)
    },
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.unshift(action.payload)
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex((e) => e.id === action.payload.id)
      if (index !== -1) {
        state.events[index] = action.payload
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((e) => e.id !== action.payload)
    },
    setTeam: (state, action: PayloadAction<TeamMember[]>) => {
      state.team = action.payload
    },
    addTeamMember: (state, action: PayloadAction<TeamMember>) => {
      state.team.push(action.payload)
    },
    updateTeamMember: (state, action: PayloadAction<TeamMember>) => {
      const index = state.team.findIndex((m) => m.id === action.payload.id)
      if (index !== -1) {
        state.team[index] = action.payload
      }
    },
    deleteTeamMember: (state, action: PayloadAction<string>) => {
      state.team = state.team.filter((m) => m.id !== action.payload)
    },
    setTestimonials: (state, action: PayloadAction<Testimonial[]>) => {
      state.testimonials = action.payload
    },
    addTestimonial: (state, action: PayloadAction<Testimonial>) => {
      state.testimonials.push(action.payload)
    },
    updateTestimonial: (state, action: PayloadAction<Testimonial>) => {
      const index = state.testimonials.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.testimonials[index] = action.payload
      }
    },
    deleteTestimonial: (state, action: PayloadAction<string>) => {
      state.testimonials = state.testimonials.filter((t) => t.id !== action.payload)
    },
  },
})

export const {
  setLoading,
  updateHeader,
  updateFooter,
  setBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  updateAbout,
  setGallery,
  addGalleryItem,
  deleteGalleryItem,
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setTeam,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  setTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = cmsSlice.actions

export default cmsSlice.reducer
