import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Result "mo:base/Result";

import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Option "mo:base/Option";

actor TaxPayerManager {
    type TaxPayer = {
        TID: Text;
        firstName: Text;
        lastName: Text;
        address: Text;
    };

    stable var taxPayerEntries : [(Text, TaxPayer)] = [];
    var taxPayers = HashMap.HashMap<Text, TaxPayer>(0, Text.equal, Text.hash);

    system func preupgrade() {
        taxPayerEntries := Iter.toArray(taxPayers.entries());
    };

    system func postupgrade() {
        taxPayers := HashMap.fromIter<Text, TaxPayer>(taxPayerEntries.vals(), 1, Text.equal, Text.hash);
    };

    public func addTaxPayer(tid: Text, firstName: Text, lastName: Text, address: Text) : async () {
        let newTaxPayer : TaxPayer = {
            TID = tid;
            firstName = firstName;
            lastName = lastName;
            address = address;
        };
        taxPayers.put(tid, newTaxPayer);
    };

    public query func getTaxPayer(tid: Text) : async ?TaxPayer {
        taxPayers.get(tid)
    };

    public query func getAllTaxPayers() : async [TaxPayer] {
        Iter.toArray(taxPayers.vals())
    };

    public query func searchTaxPayers(searchQuery: Text) : async [TaxPayer] {
        let searchResult = Array.filter<TaxPayer>(Iter.toArray(taxPayers.vals()), func (tp: TaxPayer) : Bool {
            Text.contains(tp.TID, #text searchQuery) or
            Text.contains(tp.firstName, #text searchQuery) or
            Text.contains(tp.lastName, #text searchQuery) or
            Text.contains(tp.address, #text searchQuery)
        });
        searchResult
    };
}
