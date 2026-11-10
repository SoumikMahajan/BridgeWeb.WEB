using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BridgeWeb.Domain.Model.Dto
{
    public class CoustomeFunction
    {
        public string FormatNumber(string number)
        {
            decimal decimalValue = Convert.ToDecimal(double.Parse(number, NumberStyles.Float, CultureInfo.InvariantCulture));
            // Format the number to two decimal places
            string formattedNumber = decimalValue.ToString("N2", CultureInfo.InvariantCulture);

            // Split the number into integer and fractional parts
            string[] parts = formattedNumber.Split('.');
            string integerPart = parts[0];
            string fractionalPart = parts.Length > 1 ? "." + parts[1] : string.Empty;

            // Add commas to the integer part
            integerPart = AddCommasToIntegerPart(integerPart);

            return integerPart + fractionalPart;
        }

        private string AddCommasToIntegerPart(string integerPart)
        {
            int length = integerPart.Length;
            if (length <= 3)
            {
                return integerPart;
            }

            int start = length % 3;
            string result = start == 0 ? string.Empty : integerPart.Substring(0, start);

            for (int i = start; i < length; i += 3)
            {
                if (result.Length > 0)
                {
                    result += ",";
                }
                result += integerPart.Substring(i, 3);
            }

            return result;
        }
    }
}
