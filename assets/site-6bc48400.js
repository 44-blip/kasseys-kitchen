(function () {
  var toggle = document.querySelector('.nav-toggle')
  var nav = document.getElementById('site-nav')

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true'
      toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true')
      if (isOpen) {
        nav.removeAttribute('data-open')
      } else {
        nav.setAttribute('data-open', '')
      }
    })
  }

  var errorText = 'Something went wrong. Please email galavizkassey@gmail.com.'

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault()

      if (!form.reportValidity()) return

      var button = form.querySelector('button[type="submit"]')
      var status = form.querySelector('.form-status')
      var successText = form.getAttribute('data-success') || ''

      if (button) button.disabled = true
      if (status) {
        status.hidden = true
        status.textContent = ''
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed')
          var formName = form.getAttribute('data-form')
          if (window.posthog) {
            if (formName === 'order') window.posthog.capture('order_requested')
            else if (formName === 'contact') window.posthog.capture('contact_sent')
          }
          var message = document.createElement('p')
          message.className = 'form-success'
          message.setAttribute('role', 'status')
          message.textContent = successText
          form.replaceWith(message)
        })
        .catch(function () {
          if (button) button.disabled = false
          if (status) {
            status.textContent = errorText
            status.classList.add('form-status--error')
            status.hidden = false
          }
        })
    })
  })
})()
