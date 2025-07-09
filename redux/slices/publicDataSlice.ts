import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface AboutContent {
  content: string;
  image?: string;
}
interface Settings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  businessHours: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}
interface PublicStats {
  totalEvents: number;
  totalTeamMembers: number;
  totalTestimonials: number;
}

interface PublicDataState {
  settings: Settings;
  about: AboutContent;
  stats: PublicStats;
  isLoading: boolean;
}

const initialState: PublicDataState = {
  settings: {
    siteName: "Your School",
    contactEmail: "info@school.edu",
    contactPhone: "99999999999",
    address: "123 School Street, Education City, State 12345",
    businessHours: "Monday - Friday: 8:00 AM - 5:00 PM",
    socialMedia: {},
  },
  about: { content: "", image: "" },
  stats: { totalEvents: 0, totalTeamMembers: 0, totalTestimonials: 0 },
  isLoading: true,
};

// Async thunk to fetch everything together
export const fetchPublicData = createAsyncThunk(
  "public/fetchData",
  async () => {
    const [settingsRes, aboutRes, teamRes, eventsRes, testimonialsRes] =
      await Promise.all([
        fetch("/api/settings"),
        fetch("/api/about"),
        fetch("/api/team"),
        fetch("/api/events"),
        fetch("/api/testimonials"),
      ]);

    const [settings, about, team, events, testimonials] = await Promise.all([
      settingsRes.json(),
      aboutRes.json(),
      teamRes.json(),
      eventsRes.json(),
      testimonialsRes.json(),
    ]);

    const activeTeam = (team.data || []).filter((m: any) => m.isActive);
    const activeTestimonials = (testimonials.data || []).filter(
      (t: any) => t.isActive
    );

    return {
      settings: settings.data,
      about: about.data,
      stats: {
        totalEvents: (events.data || []).length,
        totalTeamMembers: activeTeam.length,
        totalTestimonials: activeTestimonials.length,
      },
    };
  }
);

const publicDataSlice = createSlice({
  name: "publicData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPublicData.fulfilled, (state, action) => {
        state.settings = action.payload.settings;
        state.about = action.payload.about;
        state.stats = action.payload.stats;
        state.isLoading = false;
      })
      .addCase(fetchPublicData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default publicDataSlice.reducer;
