import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Migration to keep state stable after upgrade

actor {
  // Data Types
  type Message = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  type Article = {
    title : Text;
    content : Text;
    author : Text;
    date : Int;
    category : Text;
  };

  type Program = {
    name : Text;
    description : Text;
    kind : Text;
  };

  type Volunteer = {
    name : Text;
    email : Text;
    phone : Text;
    city : Text;
    motivation : Text;
    status : Text;
  };

  type SiteSettings = {
    orgName : Text;
    tagline : Text;
    address : Text;
    phone : Text;
    email : Text;
    facebookUrl : Text;
    twitterUrl : Text;
    instagramUrl : Text;
    youtubeUrl : Text;
    headerCtaText : Text;
    footerNote : Text;
    headerSubtitle : Text;
  };

  let messages = List.empty<Message>();
  let articles = List.empty<Article>();
  let programs = List.empty<Program>();
  let volunteers = Map.empty<Text, Volunteer>();

  var siteSettings : SiteSettings = {
    orgName = "GARDA Anti Narkoba Indonesia";
    tagline = "Bersama Melawan Narkoba, Selamatkan Generasi Bangsa";
    address = "Jl. Sudirman No. 123, Jakarta Pusat";
    phone = "+62 21 5000 1234";
    email = "info@gardaantinarkoba.id";
    facebookUrl = "";
    twitterUrl = "";
    instagramUrl = "";
    youtubeUrl = "";
    headerCtaText = "";
    footerNote = "";
    headerSubtitle = "";
  };

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Messaging
  public shared ({ caller }) func sendMessage(name : Text, email : Text, message : Text, timestamp : Int) : async () {
    let newMessage : Message = {
      name;
      email;
      message;
      timestamp;
    };
    messages.add(newMessage);
  };

  public query ({ caller }) func getMessages() : async [Message] {
    messages.toArray();
  };

  // Article Management
  public shared ({ caller }) func addArticle(title : Text, content : Text, author : Text, date : Int, category : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let newArticle : Article = {
      title;
      content;
      author;
      date;
      category;
    };
    articles.add(newArticle);
  };

  public query ({ caller }) func getArticles() : async [Article] {
    articles.toArray();
  };

  public query ({ caller }) func getArticlesByCategory(category : Text) : async [Article] {
    articles.toArray().filter(func(article) { article.category == category });
  };

  public shared ({ caller }) func deleteArticle(title : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let filteredArticles = articles.toArray().filter(func(article) { article.title != title });
    articles.clear();
    filteredArticles.forEach(func(article) { articles.add(article) });
  };

  public shared ({ caller }) func updateArticle(title : Text, newTitle : Text, content : Text, author : Text, category : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let updatedArticles = articles.toArray().map(
      func(article) {
        if (article.title == title) {
          {
            title = newTitle;
            content;
            author;
            date = article.date;
            category;
          };
        } else {
          article;
        };
      }
    );
    articles.clear();
    updatedArticles.forEach(func(article) { articles.add(article) });
  };

  // Program Management
  public shared ({ caller }) func addProgram(name : Text, description : Text, kind : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let newProgram : Program = {
      name;
      description;
      kind;
    };
    programs.add(newProgram);
  };

  public query ({ caller }) func getPrograms() : async [Program] {
    programs.toArray();
  };

  public query ({ caller }) func getProgramsByKind(kind : Text) : async [Program] {
    programs.toArray().filter(func(program) { program.kind == kind });
  };

  public shared ({ caller }) func deleteProgram(name : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let filteredPrograms = programs.toArray().filter(func(program) { program.name != name });
    programs.clear();
    filteredPrograms.forEach(func(program) { programs.add(program) });
  };

  public shared ({ caller }) func updateProgram(name : Text, newName : Text, description : Text, kind : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    let updatedPrograms = programs.toArray().map(
      func(program) {
        if (program.name == name) {
          {
            name = newName;
            description;
            kind;
          };
        } else {
          program;
        };
      }
    );
    programs.clear();
    updatedPrograms.forEach(func(program) { programs.add(program) });
  };

  // Volunteer Registration & Management
  public shared ({ caller }) func registerVolunteer(name : Text, email : Text, phone : Text, city : Text, motivation : Text) : async () {
    let newVolunteer : Volunteer = {
      name;
      email;
      phone;
      city;
      motivation;
      status = "pending";
    };
    volunteers.add(email, newVolunteer);
  };

  public query ({ caller }) func getVolunteers() : async [Volunteer] {
    volunteers.values().toArray();
  };

  public query ({ caller }) func getVolunteersByStatus(status : Text) : async [Volunteer] {
    volunteers.values().toArray().filter(func(volunteer) { volunteer.status == status });
  };

  public shared ({ caller }) func approveVolunteer(email : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    switch (volunteers.get(email)) {
      case (null) { Runtime.trap("Volunteer not found") };
      case (?volunteer) {
        let updatedVolunteer = { volunteer with status = "approved" };
        volunteers.add(email, updatedVolunteer);
      };
    };
  };

  public shared ({ caller }) func rejectVolunteer(email : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    switch (volunteers.get(email)) {
      case (null) { Runtime.trap("Volunteer not found") };
      case (?volunteer) {
        let updatedVolunteer = { volunteer with status = "rejected" };
        volunteers.add(email, updatedVolunteer);
      };
    };
  };

  public shared ({ caller }) func deleteVolunteer(email : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    if (not volunteers.containsKey(email)) {
      Runtime.trap("Volunteer not found");
    };
    volunteers.remove(email);
  };

  // Site Settings
  public query ({ caller }) func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  public shared ({ caller }) func updateSiteSettings(
    orgName : Text,
    tagline : Text,
    address : Text,
    phone : Text,
    email : Text,
    facebookUrl : Text,
    twitterUrl : Text,
    instagramUrl : Text,
    youtubeUrl : Text,
    headerCtaText : Text,
    footerNote : Text,
    headerSubtitle : Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    siteSettings := {
      orgName;
      tagline;
      address;
      phone;
      email;
      facebookUrl;
      twitterUrl;
      instagramUrl;
      youtubeUrl;
      headerCtaText;
      footerNote;
      headerSubtitle;
    };
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};
