var Main = React.createClass({
  componentWillMount: function(){
      $.getJSON('/goals', function(goals){

      this.setState({goals: goals})
    }.bind(this))
  },

  getInitialState: function() {
    return {
      sortBy: 'title',
    }
  },

  sortedGoals: function() {
    return _.sortBy(this.state.goals, this.state.sortBy)
  },

  tableRows: function() {
    return this.sortedGoals().map( function( goal ) {
      return <Row key={goal.id} goal={goal} />
    })
  },

  sortByNumber: function(event) {
    event.preventDefault();
    this.setState({sortBy: 'number'});
  },


  sortByTitle: function(event) {
    event.preventDefault();
    this.setState({sortBy: 'title'});
  },


  sortByMember: function(event) {
    event.preventDefault();
    var memberSorter = function(goal){
      return goal.user.login;
    }
    this.setState({sortBy: memberSorter});
  },
<<<<<<< HEAD
  //in order to sort by member name we need to get all member names into a string.
  //move complexity of member name into sortedGoals.
  //move membersorter function into sortedGOals function
=======
//in order to sort by member name we need to get all member names into a string.
//move complexity of member name into sortedGoals.
//move membersorter function into sortedGOals function
>>>>>>> d6bc5b6d5b98217b2d8614338bc6df2fd27c9897

  render: function() {
      return (
      <table>
        <thead>
          <tr>
            <th><a href="" onClick={this.sortByNumber}>Goal Number</a></th>
            <th>Labels</th>
            <th><a href="" onClick={this.sortByTitle}>Title</a></th>
            <th><a href="" onClick={this.sortByMember}>Member Name</a></th>

          </tr>
        </thead>
          <tbody>
            {this.tableRows()}
          </tbody>
      </table>
    );
  }
});

var Row = React.createClass({
  render: function() {

    return (
      //this displays data on the rows of our table
      <tr>
        <IssueNumber number={this.props.goal.number} />
        <GoalLabelsCell goal={this.props.goal} />
<<<<<<< HEAD
        <GoalTitle title={this.props.goal.title} />
        <MemberName displayName={this.props.goal.user.login} htmlUrl={this.props.goal.htmlUrl} />
=======
        <GoalTitle title={this.props.goal.title}  htmlUrl={this.props.goal.htmlUrl} />
        <MemberName displayName={this.props.goal.user.login} />
>>>>>>> d6bc5b6d5b98217b2d8614338bc6df2fd27c9897

      </tr>
    )
  }
})

var GoalTitle = React.createClass({
  render: function() {
    return <td>{this.props.title}</td>
  }
})

var MemberName = React.createClass({
  render: function() {
    return (
      <td>
        <a href={this.props.html_url}>{this.props.displayName}</a>
      </td>
    )
  }
})

//This component handles our github issue number
var IssueNumber = React.createClass({
  render: function() {
    return <td>{this.props.number}</td>
  }
})

//This component handles our labels in a new column
var GoalLabelsCell = React.createClass({
  render: function() {
    var labels = this.props.goal.labels.map( function(label){
      return <GoalLabel key={label.name} label={label}/>
    })
    return <td> {labels}</td>
  }
})

var GoalLabel = function(props) {
  var className = "GoalLabel"
  if (props.label.name === "draft") className += " GoalLabel-draft"
  return <div key={props.label.name} className={className}> {props.label.name}</div>
}



// var ImportantButton = React.createClass({
//   render: function() {
//     return (
//       <button className="important-btn">{this.props.children}</button>
//     );
//   }
// });


<<<<<<< HEAD
ReactDOM.render(<Main />, document.getElementById('content'));
=======
ReactDOM.render(<Main goals={AllGoals} />, document.getElementById('content'));
>>>>>>> d6bc5b6d5b98217b2d8614338bc6df2fd27c9897
