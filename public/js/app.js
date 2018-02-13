$(document).ready(function () {

  // Trigger for comment modal
  $('.modal').modal();

  // Comment button lisener
  $('.submit-comment-btn').on('click', function () {
    // Get _id of comment to be added
    var articleId = $(this).data("id");
    // URL root
    var baseURL = window.location.origin;
    // Get form id
    var formId = "comment-" + articleId;
    var form = $('.' + formId);
    // Call to add Comment
    $.ajax({
      url: baseURL + '/add/comment/' + articleId,
      type: 'POST',
      data: form.serialize(),
    })
      .done(function () {
        // Refresh the Window after the call is done
        location.reload();
      });
    // Prevent Default
    return false;
  });


  // Delete button lisener
  $('.delete-comment-btn').on('click', function () {
    // Get _id of comment to be deleted
    var commentId = $(this).data("id");
    // URL root
    var baseURL = window.location.origin;
    // Call to delete Comment
    $.ajax({
      url: baseURL + '/remove/comment/' + commentId,
      type: 'POST',
    })
      .done(function () {
        // Refresh the Window after the call is done
        location.reload();
      });
    // Prevent Default
    return false;
  });
});