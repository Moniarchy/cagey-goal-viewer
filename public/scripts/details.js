var Details = React.createClass({
  render: function() {
    return this.props.goals.map( function( goal ) {
      return <Row key={"goal-detail   " + goal.id} goal={goal} />
    })
  },

  render: function() {
      return (
         <div>

           <h3><IssueNumber number={this.props.goal.number} /> </h3>
           <p>Cras facilisis urna ornare ex volutpat, et
           convallis erat elementum. Ut aliquam, ipsum vitae
           gravida suscipit, metus dui bibendum est, eget rhoncus nibh
           metus nec massa. Maecenas hendrerit laoreet augue
           nec molestie. Cum sociis natoque penatibus et magnis
           dis parturient montes, nascetur ridiculus mus.</p>

           <p></p>
         </div>
    );
  }
});

var DetailsPage = React.createClass({
  render: function() {
    return (
        <MemberName displayName={this.props.goal.user.login} htmlUrl={this.props.goal.htmlUrl} />
    )
  }
})

var IssueTitle = React.createClass({
  render: function() {
    return <td>{this.props.title}</td>
  }
})
ReactDOM.render(<Details goals={AllGoals} />, document.getElementById('details'));
