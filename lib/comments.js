const formatToHtmlEntities = (text) => {
  const formatted = text.replace(/ /g, '&nbsp');
  return formatted.replace(/\n/g, '<br>');
};

class Comment {
  constructor(usrName, comment, date) {
    this.usrName = usrName;
    this.comment = comment;
    this.date = date;
  }
  toHTMLString(){
    const usrName = formatToHtmlEntities(this.usrName);
    const comment = formatToHtmlEntities(this.comment);
    let cmt = '';
    cmt += '<div class="guestCommentBox">';
    cmt += `<span class="cmtGuestName">${usrName}</span> `;
    cmt += `<span class="cmtDate">${this.date.toLocaleString()}</span><br>`;
    cmt += `<span>${comment}</span></div>`;
    return cmt;
  }
}

module.exports = {Comment};
