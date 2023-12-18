const footerData = [
  {
    href: 'https://www.seejonesengineer.com/CJonesSWEPortfolioResume2023.pdf',
    icon: 'fa-solid fa-file-pdf',
    tooltip: 'View My Resume',
  },
  {
    href: 'mailto:cj@seejonesengineer.com',
    icon: 'fa-solid fa-at',
    tooltip: 'Email Me',
  },
  {
    href: 'https://www.seejonesengineer.com/',
    icon: 'fa-solid fa-user-tie',
    tooltip: 'View My Portfolio',
  },
  {
    href: 'https://www.linkedin.com/in/cjones1827/',
    icon: 'fa-brands fa-linkedin',
    tooltip: 'Connect With Me On LinkedIn',
  },
  {
    href: 'https://www.github.com/cjones-87/',
    icon: 'fa-brands fa-github',
    tooltip: 'View My GitHub',
  },
  {
    href: 'https://twitter.com/cjonesengineer1',
    icon: 'fa-brands fa-twitter',
    tooltip: 'Connect With Me On Twitter/X',
  },
];

const footerText = document.getElementById('footerText');

footerText.innerHTML =
  '<span>Designed & Built by <a id="websiteCredit" href="https://www.linkedin.com/in/cjones1827/" target="_blank">CJ Jones</a> of <a id="websiteCredit" href="https://www.seejonesengineer.com/" target="_blank">SeeJonesEngineer.com</a> © 2021 - ' +
  new Date().getFullYear() +
  '</span>';

const footerIconsContainer = document.getElementById('footerIcons');

footerData.map((item) => {
  console.log(item.href);

  const link = document.createElement('a');
  link.href = item.href;
  link.rel = 'noreferrer';
  link.target = '_blank';
  link.title = item.tooltip;

  const icon = document.createElement('i');
  icon.className = item.icon;
  icon.style.color = 'indigo';
  icon.style.cursor = 'pointer';
  link.appendChild(icon);

  footerIconsContainer.appendChild(link);
});
