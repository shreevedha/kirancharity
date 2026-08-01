import { useState } from 'react'
import { FaTimes, FaPlay, FaCamera, FaVideo, FaCalendarAlt, FaStethoscope, FaUtensils, FaGraduationCap, FaTint, FaSearch } from 'react-icons/fa'
import './Gallery.css'

// Import actual images
import imgWelcome from '../assets/help.png'
import imgKids from '../assets/gallery_kids.png'
import imgDistribution from '../assets/gallery_distribution.png'
import imgHealth from '../assets/gallery_health.png'
import imgWomen from '../assets/gallery_women.png'
import imgAnimal from '../assets/gallery_animal.png'
import imgSenior from '../assets/gallery_senior.png'
import imgDisaster from '../assets/cause_disaster.png'
import imgHero from '../assets/medical_camp.png'
import imgHero1 from '../assets/hero1.png'
import imgHero3 from '../assets/hero3.png'
import imgFun from '../assets/fun.png'

const categories = [
    { id: 'all', label: 'All', icon: <FaCamera /> },
    { id: 'events', label: 'Events', icon: <FaCalendarAlt /> },
    { id: 'medical', label: 'Medical Camps', icon: <FaStethoscope /> },
    { id: 'food', label: 'Food Distribution', icon: <FaUtensils /> },
    { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
    { id: 'blood', label: 'Blood Donation', icon: <FaTint /> },
]

const galleryItems = [
    {
        id: 1,
        type: 'image',
        category: 'events',
        label: 'Annual Trust Meet - Kiran Charitable Trust Members & Donors',
        img: imgWelcome,
    },
    {
        id: 2,
        type: 'image',
        category: 'education',
        label: 'Distribution of Free Notebooks & School Bags to Rural Children',
        img: imgKids,
    },
    {
        id: 3,
        type: 'image',
        category: 'food',
        label: 'Daily Hot Food Distribution for Underprivileged Families',
        img: imgDistribution,
    },
    {
        id: 4,
        type: 'image',
        category: 'medical',
        label: 'General Health Diagnostics and Free Medicine Distribution Camp',
        img: imgHealth,
    },
    {
        id: 5,
        type: 'image',
        category: 'events',
        label: 'Sewing Machines and Skill Development Project for Women',
        img: imgWomen,
    },
    {
        id: 6,
        type: 'image',
        category: 'events',
        label: 'Stray Animal Rescue, Feeding and Treatment Drive',
        img: imgAnimal,
    },
    {
        id: 7,
        type: 'image',
        category: 'events',
        label: 'Elderly Support Visit - Distributing Rations and Essentials',
        img: imgSenior,
    },
    {
        id: 8,
        type: 'image',
        category: 'events',
        label: 'Emergency Flood Relief - Temporary Shelter and Rations Support',
        img: imgDisaster,
    },
    {
        id: 9,
        type: 'image',
        category: 'education',
        label: 'Computer Training and Digital Literacy for School Kids',
        img: imgKids,
    },
    {
        id: 10,
        type: 'image',
        category: 'medical',
        label: 'Blood Pressure and Sugar Screening Diagnostics Camps',
        img: imgHealth,
    },
    {
        id: 11,
        type: 'image',
        category: 'events',
        label: 'Community Medical Support and Gathering Camp',
        img: imgHero,
    },
    {
        id: 12,
        type: 'image',
        category: 'food',
        label: 'Distribution of Dry Ration Kits to Needy Families',
        img: imgHero1,
    },
    {
        id: 13,
        type: 'image',
        category: 'education',
        label: 'Notebook and Classroom Resources Support for Kids',
        img: imgHero3,
    },
    {
        id: 14,
        type: 'image',
        category: 'events',
        label: 'Community Fun & Group Engagement Events',
        img: imgFun,
    },
]

const videos = [
    { title: 'Kiran Charitable Trust - Our Journey', embedUrl: 'https://www.youtube.com/embed/TqhNILVX8IE' },
    { title: 'Making a Difference in Communities', embedUrl: 'https://www.youtube.com/embed/gP6p7_Sd3MU' },
    { title: 'Our Impact Stories', embedUrl: 'https://www.youtube.com/embed/6Oix9n4vEUk' },
]

export default function Gallery() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [lightbox, setLightbox] = useState(null)

    const filtered = activeCategory === 'all'
        ? galleryItems
        : galleryItems.filter(i => i.category === activeCategory)

    return (
        <div className="gallery-page">
            <div className="page-banner">
                <div className="banner-circles" />
                <div className="container">
                    <h1>Our Gallery</h1>
                    <p className="breadcrumb"><span>Home / </span>Gallery</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="container">
                    {/* Filter Tabs */}
                    <div className="gallery-filters">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`gallery-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Photos Grid */}
                    <h3 className="gallery-section-title"><FaCamera /> Photos</h3>
                    <div className="gallery-grid">
                        {filtered.map(item => (
                            <div
                                key={item.id}
                                className="gallery-item"
                                onClick={() => setLightbox(item)}
                            >
                                <div className="gallery-thumb">
                                    <img src={item.img} alt={item.label} className="gallery-img-tag" />
                                    <div className="gallery-overlay">
                                        <button className="gallery-expand-btn" aria-label="View full size">
                                            <FaSearch />
                                        </button>
                                    </div>
                                </div>
                                <div className="gallery-item-label">
                                    <span className={`gallery-cat-badge gallery-cat-${item.category}`}>
                                        {categories.find(c => c.id === item.category)?.label}
                                    </span>
                                    <p>{item.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Videos Section */}
                    <h3 className="gallery-section-title" style={{ marginTop: 60 }}><FaVideo /> Visualizations & Camps</h3>
                    <div className="videos-grid">
                        {videos.map((v, i) => (
                            <div key={i} className="video-card">
                                <div className="video-iframe-wrap">
                                    <iframe
                                        src={v.embedUrl}
                                        title={v.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <div className="video-info">
                                    <h4>{v.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {lightbox && (
                <div className="lightbox" onClick={() => setLightbox(null)}>
                    <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">
                        <FaTimes />
                    </button>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <div className="lightbox-img-wrap">
                            <img src={lightbox.img} alt={lightbox.label} className="lightbox-real-img" />
                        </div>
                        <div className="lightbox-caption">
                            <h3>{lightbox.label}</h3>
                            <p>{categories.find(c => c.id === lightbox.category)?.label}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

