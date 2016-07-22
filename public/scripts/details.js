var Details = React.createClass({
  render: function() {
    return this.props.goals.map( function( goal ) {
      return <Row key={"goal-" + goal.id} goal={goal} />
    })
  },

  render: function() {
      return (
         <div>
           <h2> <IssueTitle title={this.props.goal.title} /> </h2>
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

// //
// var Main = React.createClass({
//   getInitialState: function() {
//     return {
//       sortBy: 'title',
//     }
//   },
//
//   sortedGoals: function() {
//     return _.sortBy(this.props.goals, this.state.sortBy)
//   },
//
//   tableRows: function() {
//     return this.sortedGoals().map( function( goal ) {
//       return <Row key={goal.id} goal={goal} />
//     })
//   },
//
//   sortByNumber: function(event) {
//     event.preventDefault();
//     this.setState({sortBy: 'number'});
//   },
//
//
//   sortByTitle: function(event) {
//     event.preventDefault();
//     this.setState({sortBy: 'title'});
//   },
//
//
//   sortByMember: function(event) {
//     event.preventDefault();
//     var memberSorter = function(goal){
//       return goal.user.login;
//     }
//     this.setState({sortBy: memberSorter});
//   },
// //in order to sort by member name we need to get all member names into a string.
// //move complexity of member name into sortedGoals.
// //move membersorter function into sortedGOals function
//
//   render: function() {
//       return (
//       <table>
//         <thead>
//           <tr>
//             <th><a href="" onClick={this.sortByNumber}>Goal Number</a></th>
//             <th>Labels</th>
//             <th><a href="" onClick={this.sortByTitle}>Title</a></th>
//             <th><a href="" onClick={this.sortByMember}>Member Name</a></th>
//
//           </tr>
//         </thead>
//           <tbody>
//             {this.tableRows()}
//           </tbody>
//       </table>
//     );
//   }
// });
//
// var Row = React.createClass({
//   render: function() {
//
//     return (
//       //this displays data on the rows of our table
//       <tr>
//         <IssueNumber number={this.props.goal.number} />
//         <GoalLabelsCell goal={this.props.goal} />
//         <GoalTitle title={this.props.goal.title}  htmlUrl={this.props.goal.htmlUrl} />
//         <MemberName displayName={this.props.goal.user.login} />
//
//       </tr>
//     )
//   }
// })
//
// var GoalTitle = React.createClass({
//   render: function() {
//     return <td>{this.props.title}</td>
//   }
// })
//
// var MemberName = React.createClass({
//   render: function() {
//     return (
//       <td>
//         <a href={this.props.html_url}>{this.props.displayName}</a>
//       </td>
//     )
//   }
// })
//
// //This component handles our github issue number
// var IssueNumber = React.createClass({
//   render: function() {
//     return <td>{this.props.number}</td>
//   }
// })
//
// //This component handles our labels in a new column
// var GoalLabelsCell = React.createClass({
//   render: function() {
//     var labels = this.props.goal.labels.map( function(label){
//       return <GoalLabel key={label.name} label={label}/>
//     })
//     return <td> {labels}</td>
//   }
// })
//
// var GoalLabel = function(props) {
//   var className = "GoalLabel"
//   if (props.label.name === "draft") className += " GoalLabel-draft"
//   return <div key={props.label.name} className={className}> {props.label.name}</div>
// }
//
//
//
// // var ImportantButton = React.createClass({
// //   render: function() {
// //     return (
// //       <button className="important-btn">{this.props.children}</button>
// //     );
// //   }
// // });
//
//
// ReactDOM.render(<Main goals={AllGoals} />, document.getElementById('content'));


ReactDOM.render(<Details goals={AllGoals} />, document.getElementById('details'));
