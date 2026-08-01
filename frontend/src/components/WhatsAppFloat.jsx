import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsAppFloat() {
    return (
        <a
            href="https://wa.me/917702468889"
            className="whatsapp-float"
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            title="Chat with us on WhatsApp"
        >
            <FaWhatsapp />
        </a>
    )
}
