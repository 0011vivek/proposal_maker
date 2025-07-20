import React, { useState } from 'react';
import axios from 'axios';
import './ProposalForm.css'; // ✅ Import the CSS file

const serviceOptions = [
  "Web Development",
  "App Development",
  "SEO Services",
  "Cloud Hosting",
  "UI/UX Design",
  "Maintenance & Support"
];

const ProposalForm = () => {
  const [clientName, setClientName] = useState('');
  const [contact, setContact] = useState('');
  const [description] = useState('We propose the following services.');
  const [items, setItems] = useState([{ name: '', qty: 1, price: 0 }]);
  const [pdfUrl, setPdfUrl] = useState('');

  const addItem = () => {
    setItems([...items, { name: '', qty: 1, price: 0 }]);
  };

  const handleChange = (i, e) => {
    const newItems = [...items];
    newItems[i][e.target.name] = e.target.value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { clientName, contact, description, items };

    try {
      const res = await axios.post('http://localhost:3000/api/proposals', payload, {
        responseType: 'blob'
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(blob);
      setPdfUrl(fileUrl);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Is your backend running?');
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Proposal Maker</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Client Name"
          onChange={(e) => setClientName(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Contact (email/phone)"
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <p>{description}</p>

        {items.map((item, index) => (
          <div key={index} className="item-row">
            <select
              name="name"
              value={item.name}
              onChange={(e) => handleChange(index, e)}
              className="select-input"
              required
            >
              <option value="">Select Service</option>
              {serviceOptions.map((service, idx) => (
                <option key={idx} value={service}>{service}</option>
              ))}
            </select>

            <input
              name="qty"
              type="number"
              placeholder="Qty"
              value={item.qty}
              onChange={(e) => handleChange(index, e)}
              className="small-input"
              required
            />
            <input
              name="price"
              type="number"
              placeholder="Unit Price"
              value={item.price}
              onChange={(e) => handleChange(index, e)}
              className="small-input"
              required
            />
          </div>
        ))}

        <button type="button" className="button" onClick={addItem}>Add Item</button>
        <button type="submit" className="submit-button">Generate PDF</button>

        {pdfUrl && (
          <div className="download-link">
            <a href={pdfUrl} download="proposal.pdf">📄 Download PDF</a>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProposalForm;
