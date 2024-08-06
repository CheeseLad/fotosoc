import React from 'react'

const Contact = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8">
  <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
  <p className="text-lg px-10 text-center">Fill in the form or send us an email at <a className="hover:underline" href="mailto:webmasterdcufotosoc@gmail.com">webmasterdcufotosoc@gmail.com</a></p>
    <div className="bg-white rounded-lg shadow-xl p-6 mt-10 mx-10 md:min-w-[500px] sm:min-w-[400px]"> {/* Added min-w-[300px] */}
    <form 
          action="https://formspree.io/f/" 
          method="POST"
          className='text-black text-left'
          >
          <div>
            <label for="contact-name" className='block mb-2 text-sm font-medium'>Name</label>
            <input id="contact-name" type="text" name="contact-name" placeholder="Foto Person" required />
          </div>
          <div>
            <label for="contact-email" className='block mb-2 text-sm font-medium'>Email Address</label>
            <input id="contact-email" type="email" name="email" placeholder="foto_person@gmail.com" required /> </div>
            <div>
              <label for="contact-message" className='block mb-2 text-sm font-medium'>Message</label>
              <textarea id="contact-message" name="message" rows="5"> </textarea>
            </div>
            <div>
              <div class="submitbutton">
                <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-600/50 hvr-grow">Send Message</button>
              </div>
            </div>
      </form>
    </div>
</div>

  )
}

export default Contact