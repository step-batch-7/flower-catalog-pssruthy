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

class Comments {
  constructor(){
    this.comments = [];
  }

  add(comment) {
    this.comments.unshift(comment);
  }

  toHTMLString(){
    return this.comments.reduce((htmlComments, cmt) => {
      return `${htmlComments}</br>${cmt.toHTMLString()}`;
    }, '');
  }

  static load(commentList){
    const comments = new Comments();
    commentList.forEach((cmt) => {
      const {usrName, comment, date} = cmt;
      comments.add(new Comment(usrName, comment, date));
    });
    return comments;
  }
  
  toJSON() {
    return JSON.stringify(this.comments);
  }
}

module.exports = {Comment, Comments};
