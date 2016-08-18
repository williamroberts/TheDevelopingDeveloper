s3_bucket=thedevelopingdeveloper.com
aws s3api list-buckets --query "Buckets[?Name==\`\"$s3_bucket\"\`].Name" --output text;

function getAWSDNSEndPoint() {
  aws route53 list-resource-record-sets --hosted-zone-id "$1" --query "ResourceRecordSets[?Name==\`\"$2\"\`].ResourceRecords[]" --output text;
}

