document.addEventListener('DOMContentLoaded', () => {

function redirectToEmail() {
    var email = "annusallokiya90893@gmail.com"; // Yahan apni email ID daliye
    var subject = "Contact for business purpose"; // Subject ko customize kar sakte hain
    var body = "Put your message here....."; // Body ko customize kar sakte hain

    var mailtoLink = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    window.location.href = mailtoLink;
}
});

