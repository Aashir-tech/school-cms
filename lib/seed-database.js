const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

const uri = process.env.MONGODB_URI

async function seedDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("school-cms")

    // Create admin user
    const usersCollection = db.collection("users")
    const existingAdmin = await usersCollection.findOne({ email: "admin@school.edu" })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await usersCollection.insertOne({
        email: "admin@school.edu",
        password: hashedPassword,
        name: "Admin User",
        role: "admin",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log("✅ Admin user created")
    } else {
      console.log("ℹ️  Admin user already exists")
    }

    // Create sample banners
    const bannersCollection = db.collection("banners")
    const bannerCount = await bannersCollection.countDocuments()

    if (bannerCount === 0) {
      const sampleBanners = [
        {
          image: "/images/uploads/pexels-jeswin-3380743-1752051602807-121831565.jpg",
          heading: "Welcome to Our School",
          subheading: "Providing quality education for a brighter future",
          buttonLabel: "Learn More",
          buttonLink: "/about",
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
        },
        {
          image: "/placeholder.svg?height=600&width=1200",
          heading: "Excellence in Education",
          subheading: "Nurturing young minds with innovative teaching methods",
          buttonLabel: "Explore Programs",
          buttonLink: "/programs",
          order: 2,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
        },
      ]

      await bannersCollection.insertMany(sampleBanners)
      console.log("✅ Sample banners created")
    }

    // Create sample events
    const eventsCollection = db.collection("events")
    const eventCount = await eventsCollection.countDocuments()

    if (eventCount === 0) {
      const sampleEvents = [
        {
          title: "Annual Science Fair",
          description: "Students showcase their innovative science projects and experiments.",
          date: new Date("2024-03-15"),
          location: "School Auditorium",
          image: "/placeholder.svg?height=200&width=300",
          isActive: true,
          isFeatured: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
        },
        {
          title: "Sports Day Championship",
          description: "Inter-house sports competition featuring various athletic events.",
          date: new Date("2024-03-22"),
          location: "School Playground",
          image: "/placeholder.svg?height=200&width=300",
          isActive: true,
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
        },
      ]

      await eventsCollection.insertMany(sampleEvents)
      console.log("✅ Sample events created")
    }

    // Create sample team members
    const teamCollection = db.collection("team")
    const teamCount = await teamCollection.countDocuments()

    if (teamCount === 0) {
      const sampleTeamMembers = [
        {
          name: "Dr. Sarah Johnson",
          photo: "/placeholder.svg?height=300&width=300",
          designation: "Principal",
          bio: "Dr. Johnson has over 20 years of experience in educational leadership and is passionate about creating inclusive learning environments.",
          email: "principal@school.edu",
          phone: "(555) 123-4567",
          socialLinks: {
            linkedin: "https://linkedin.com/in/sarah-johnson",
            twitter: "https://twitter.com/sarahjohnson",
          },
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
        },
        {
          name: "Michael Chen",
          photo: "/placeholder.svg?height=300&width=300",
          designation: "Vice Principal",
          bio: "Michael brings innovative teaching methods and technology integration to our school community.",
          email: "vp@school.edu",
          phone: "(555) 123-4568",
          socialLinks: {
            linkedin: "https://linkedin.com/in/michael-chen",
          },
          order: 2,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
        },
      ]

      await teamCollection.insertMany(sampleTeamMembers)
      console.log("✅ Sample team members created")
    }

    // Create sample testimonials
    const testimonialsCollection = db.collection("testimonials")
    const testimonialCount = await testimonialsCollection.countDocuments()

    if (testimonialCount === 0) {
      const sampleTestimonials = [
        {
          name: "Sarah Johnson",
          photo: "/placeholder.svg?height=80&width=80",
          quote:
            "This school has provided my child with an excellent education and a supportive environment. The teachers are dedicated and caring.",
          rating: 5,
          designation: "Parent",
          isActive: true,
          isFeatured: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
        },
        {
          name: "Michael Chen",
          photo: "/placeholder.svg?height=80&width=80",
          quote:
            "The facilities are outstanding and the curriculum is well-balanced. My daughter has thrived here both academically and socially.",
          rating: 5,
          designation: "Parent",
          isActive: true,
          isFeatured: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
        },
      ]

      await testimonialsCollection.insertMany(sampleTestimonials)
      console.log("✅ Sample testimonials created")
    }

    // Create sample gallery items
    const galleryCollection = db.collection("gallery")
    const galleryCount = await galleryCollection.countDocuments()

    if (galleryCount === 0) {
      const sampleGalleryItems = [
        {
          url: "/placeholder.svg?height=400&width=600",
          alt: "School Building Exterior",
          category: "Campus",
          caption: "Our beautiful main building",
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
        },
        {
          url: "/placeholder.svg?height=400&width=600",
          alt: "Students in Science Lab",
          category: "Academics",
          caption: "Students conducting experiments in our modern science lab",
          order: 2,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
        },
        {
          url: "/placeholder.svg?height=400&width=600",
          alt: "Sports Day Event",
          category: "Events",
          caption: "Annual sports day celebration",
          order: 3,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: "system",
        },
      ]

      await galleryCollection.insertMany(sampleGalleryItems)
      console.log("✅ Sample gallery items created")
    }

    // Create about content
    const aboutCollection = db.collection("about")
    const aboutContent = await aboutCollection.findOne({})

    if (!aboutContent) {
      await aboutCollection.insertOne({
        content: `
          <h2>About Our School</h2>
          <p>Our school has been a cornerstone of educational excellence for over 50 years. We are committed to providing a nurturing environment where students can grow academically, socially, and personally.</p>
          <p>With state-of-the-art facilities, experienced faculty, and a comprehensive curriculum, we prepare our students for success in an ever-changing world. Our approach combines traditional values with innovative teaching methods.</p>
          <p>We believe in developing well-rounded individuals who are not only academically proficient but also possess strong character, leadership skills, and a sense of social responsibility.</p>
        `,
        image: "/placeholder.svg?height=500&width=600",
        updatedAt: new Date(),
        updatedBy: "system",
      })
      console.log("✅ About content created")
    }

    console.log("🎉 Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    await client.close()
  }
}

module.exports = { seedDatabase }
