//namespace BridgeWeb.Domain.Model.Dto.QuickBook
//{
//    public class QBODepositResponse
//    {
//        public Queryresponse QueryResponse { get; set; }
//        public DateTime time { get; set; }
//    }

//    public class Queryresponse
//    {
//        public int startPosition { get; set; }
//        public int totalCount { get; set; }
//        public Deposit[] Deposit { get; set; }
//        public int maxResults { get; set; }
//    }

//    public class Deposit
//    {
//        public string SyncToken { get; set; }
//        public string domain { get; set; }
//        public Deposittoaccountref DepositToAccountRef { get; set; }
//        public string TxnDate { get; set; }
//        public float TotalAmt { get; set; }
//        public bool sparse { get; set; }
//        public Line[] Line { get; set; }
//        public string Id { get; set; }
//        public Metadata MetaData { get; set; }
//        public string PrivateNote { get; set; }
//    }

//    public class Deposittoaccountref
//    {
//        public string name { get; set; }
//        public string value { get; set; }
//    }

//    public class Line
//    {
//        public float Amount { get; set; }
//        public Projectref ProjectRef { get; set; }
//        public Linkedtxn[] LinkedTxn { get; set; }
//        public int LineNum { get; set; }
//        public string Id { get; set; }
//        public Depositlinedetail DepositLineDetail { get; set; }
//        public string DetailType { get; set; }
//    }

//    public class Projectref
//    {
//        public string value { get; set; }
//    }

//    public class Depositlinedetail
//    {
//        public Accountref AccountRef { get; set; }
//    }

//    public class Accountref
//    {
//        public string name { get; set; }
//        public string value { get; set; }
//    }

//    public class Linkedtxn
//    {
//        public string TxnLineId { get; set; }
//        public string TxnId { get; set; }
//        public string TxnType { get; set; }
//    }

//}
