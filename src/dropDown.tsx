import { Text, View } from 'react-native'
import React, { useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'

const dropDown = () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<any>(null);
    const [items, setItems] = useState([
        { label: 'DEV', value: 'deve' },
        { label: 'VAL', value: 'val' },
        { label: 'PROD', value: 'prod' }
    ]);
    return (
        <View>
            <Text style={{ marginLeft: 20, marginTop: 20 }}>Dropdown</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                style={{ backgroundColor: 'white', marginTop: 20, width: '90%', alignSelf: 'center' }}
                placeholder='Select an Environment'
                dropDownContainerStyle={{ alignSelf: 'center', backgroundColor: 'white', width: '90%', marginTop: 20 }}
            />
        </View>
    )
}

export default dropDown